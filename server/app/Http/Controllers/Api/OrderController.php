<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Lấy danh sách tất cả các đơn hàng của người mua hiện tại.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user(); // Lấy người dùng hiện tại
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401); // Unauthorized
        }

        $orders = Order::query()
                       ->where('buyer_id', $user->id) // CHỈ LẤY ĐƠN HÀNG CỦA NGƯỜI MUA HIỆN TẠI
                       ->with('items.product'); // Tải các mối quan hệ (nếu cần)

        // Ví dụ bộ lọc theo trạng thái
        if ($request->has('status')) {
            $orders->where('status', $request->input('status'));
        }

        $orders = $orders->paginate(10); // Phân trang 10 đơn hàng mỗi trang

        return response()->json([
            'message' => 'Lấy danh sách đơn hàng thành công.',
            'orders' => $orders
        ], 200);
    }

    /**
     * Tạo một đơn hàng mới.
     * Yêu cầu dữ liệu: cart_items (mảng các product_id và quantity), shipping_address, payment_method.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'shipping_address' => 'required|string',
                'payment_method' => 'required|in:cod,shopeepay,bank_transfer',
                'cart_items' => 'required|array', // Mảng các sản phẩm trong giỏ hàng
                'cart_items.*.product_id' => 'required|exists:products,id',
                'cart_items.*.quantity' => 'required|integer|min:1',
            ]);

            $buyerId = Auth::id(); // Lấy ID của người mua hiện tại
            if (!$buyerId) {
                return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
            }

            DB::beginTransaction();

            // Tính toán tổng giá và phí vận chuyển (ví dụ đơn giản)
            $totalPrice = 0;
            $shippingFee = 25000; // Phí vận chuyển cố định (ví dụ 25.000 VND)

            $sellerIds = []; // Thu thập các seller_id để tạo nhiều đơn hàng nếu cần

            // Xử lý từng sản phẩm trong giỏ hàng để tính tổng giá và xác định người bán
            foreach ($request->cart_items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    DB::rollBack();
                    return response()->json(['message' => 'Sản phẩm không tồn tại: ' . $item['product_id']], 404);
                }
                $totalPrice += $product->price * $item['quantity'];
                $sellerIds[$product->seller_id] = true; // Lưu ID người bán
            }

            // Trong ứng dụng thực tế của Shopee, có thể tạo nhiều đơn hàng cho nhiều người bán khác nhau
            // hoặc nhóm các sản phẩm từ cùng một người bán vào một đơn hàng.
            // Đây là ví dụ đơn giản nhất, lấy người bán đầu tiên trong danh sách sản phẩm.
            $sellerId = !empty($sellerIds) ? array_key_first($sellerIds) : null;
            if (is_null($sellerId)) {
                DB::rollBack();
                return response()->json(['message' => 'Không tìm thấy người bán cho sản phẩm trong giỏ hàng.'], 400);
            }

            $order = Order::create([
                'buyer_id' => $buyerId,
                'seller_id' => $sellerId,
                'order_code' => 'ORD-' . Str::random(10) . time(), // Tạo mã đơn hàng duy nhất
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'shipping_fee' => $shippingFee,
                'total_price' => $totalPrice + $shippingFee,
                'payment_method' => $request->payment_method,
                'payment_status' => 'unpaid', // Mặc định là chưa thanh toán
            ]);

            // Thêm các item vào bảng order_items
            foreach ($request->cart_items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => Product::find($item['product_id'])->price, // Lưu giá tại thời điểm đặt hàng
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Đơn hàng đã được tạo thành công!',
                'order' => $order->load('items.product') // Tải các mối quan hệ (nếu cần)
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Dữ liệu đầu vào không hợp lệ.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi tạo đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy chi tiết một đơn hàng cụ thể của người mua hiện tại.
     *
     * @param  int  $id ID của đơn hàng
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $order = Order::with('items.product')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        // Kiểm tra quyền: Đảm bảo người dùng hiện tại là người mua của đơn hàng này
        if ($order->buyer_id !== Auth::id()) {
            return response()->json(['message' => 'Bạn không có quyền xem đơn hàng này.'], 403);
        }

        // Tải thêm các mối quan hệ nếu cần, ví dụ: user, seller, v.v.
        // $order->load('user', 'seller'); // nếu có quan hệ user và seller trong model Order
        // $order->load('orderItems.product'); // đảm bảo có quan hệ orderItems và product trong model Order
        return response()->json([
            'message' => 'Lấy thông tin đơn hàng thành công.',
            'order' => $order
        ], 200);
    }

    /**
     * Cập nhật trạng thái của đơn hàng (thường dùng cho quản trị viên hoặc người bán).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id ID của đơn hàng
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'shipping_address' => 'sometimes|string',
                'payment_method' => 'sometimes|in:cod,shopeepay,bank_transfer',
                'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled', // Admin/Seller có thể cập nhật
                'payment_status' => 'sometimes|in:paid,unpaid',
            ]);

            $order = Order::find($id);

            if (!$order) {
                return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
            }

            // Chỉ người bán hoặc quản trị viên mới được cập nhật thông tin này (ngoại trừ địa chỉ giao hàng)
            // if ($order->seller_id !== Auth::id() && !Auth::user()->is_admin) {
            //     return response()->json(['message' => 'Bạn không có quyền cập nhật đơn hàng này.'], 403);
            // }

            $order->fill($request->all());
            $order->save();

            return response()->json([
                'message' => 'Đơn hàng đã được cập nhật thành công.',
                'order' => $order
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Dữ liệu đầu vào không hợp lệ.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hủy đơn hàng.
     * Thường chỉ có thể hủy nếu đơn hàng đang ở trạng thái 'pending' hoặc 'processing'.
     *
     * @param  int  $id ID của đơn hàng
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        // Kiểm tra quyền: Đảm bảo người dùng hiện tại là người mua của đơn hàng này
        if ($order->buyer_id !== Auth::id()) { // Đã bỏ comment và áp dụng check cho người mua
            return response()->json(['message' => 'Bạn không có quyền hủy đơn hàng này.'], 403);
        }

        // Kiểm tra trạng thái đơn hàng có được phép hủy không
        if ($order->status === 'delivered' || $order->status === 'shipped') {
            return response()->json(['message' => 'Không thể hủy đơn hàng đã giao hoặc đang vận chuyển.'], 400); // 400 Bad Request
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'message' => 'Đơn hàng đã được hủy thành công.',
            'order' => $order
        ], 200);
    }

    /**
     * Xác nhận người mua đã nhận được hàng.
     * Chỉ người mua mới có thể thực hiện và khi đơn hàng ở trạng thái 'shipped'.
     *
     * @param int $id ID của đơn hàng
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmDelivery($id)
    {
        $order = Order::find($id); //

        if (!$order) { //
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404); //
        }

        // Kiểm tra quyền: Đảm bảo người dùng hiện tại là người mua của đơn hàng này
        if ($order->buyer_id !== Auth::id()) { //
            return response()->json(['message' => 'Bạn không có quyền xác nhận đơn hàng này.'], 403); //
        }

        // Kiểm tra trạng thái đơn hàng: Chỉ có thể xác nhận khi trạng thái là 'shipped' (đã giao cho đơn vị vận chuyển)
        if ($order->status !== 'shipped') { //
            return response()->json(['message' => 'Không thể xác nhận nhận hàng cho đơn hàng ở trạng thái hiện tại.'], 400); //
        }

        $order->status = 'delivered'; //
        $order->save(); //

        return response()->json([ //
            'message' => 'Đơn hàng đã được xác nhận đã nhận thành công.', //
            'order' => $order //
        ], 200); //
    }
}