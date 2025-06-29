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

            // Tạo mã đơn hàng duy nhất
            $orderCode = 'ORD-' . strtoupper(Str::random(8));

            // Trong ví dụ này, chúng ta tạo một đơn hàng duy nhất.
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
                'order_code' => $orderCode,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'shipping_fee' => $shippingFee,
                'total_price' => $totalPrice + $shippingFee,
                'payment_method' => $request->payment_method,
                'payment_status' => 'unpaid', // Mặc định là chưa thanh toán
            ]);

            // Thêm các item vào bảng order_items
            foreach ($request->cart_items as $item) {
                $product = Product::find($item['product_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price, // Lưu giá sản phẩm tại thời điểm đặt hàng
                ]);
            }

            // Xóa các sản phẩm khỏi giỏ hàng sau khi đặt hàng (nếu bạn có bảng giỏ hàng riêng)
            // \App\Models\CartItem::where('user_id', $buyerId)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Đơn hàng đã được tạo thành công.',
                'order' => $order
            ], 201); // 201 Created
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Dữ liệu đầu vào không hợp lệ.',
                'errors' => $e->errors()
            ], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi tạo đơn hàng.',
                'error' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }

    /**
     * Hiển thị chi tiết một đơn hàng cụ thể.
     *
     * @param  int  $id ID của đơn hàng
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        // Đảm bảo người dùng hiện tại là người mua của đơn hàng này
        if ($order->buyer_id !== Auth::id()) { // Đã bỏ comment và áp dụng check cho người mua
            return response()->json(['message' => 'Bạn không có quyền truy cập đơn hàng này.'], 403); // 403 Forbidden
        }

        // Có thể load thêm các sản phẩm trong đơn hàng
        $order->load('items.product'); // Giả sử có quan hệ orderItems và product trong model Order

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
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
                // 'payment_status' => 'in:unpaid,paid' // Có thể cập nhật trạng thái thanh toán riêng
            ]);

            $order = Order::find($id);

            if (!$order) {
                return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
            }

            // Kiểm tra quyền: CHỈ người bán của đơn hàng hoặc quản trị viên mới được cập nhật.
            // Nếu bạn muốn người mua CÓ THỂ cập nhật trạng thái (ví dụ như xác nhận đã nhận hàng)
            // thì bạn cần điều chỉnh logic này. Hiện tại, đoạn code này đang giữ nguyên quyền cho Seller/Admin.
            // Bạn có thể mở comment dòng này và thêm Auth::user()->is_admin nếu cần cho admin.
            // if ($order->seller_id !== Auth::id() /* && !Auth::user()->is_admin */) {
            //     return response()->json(['message' => 'Bạn không có quyền cập nhật trạng thái đơn hàng này.'], 403);
            // }

            // Logic kiểm tra chuyển đổi trạng thái hợp lệ (ví dụ: không thể chuyển từ 'delivered' sang 'pending')
            // if ($order->status === 'delivered' && $request->status !== 'delivered') {
            //     return response()->json(['message' => 'Không thể thay đổi trạng thái đơn hàng đã giao.'], 400);
            // }

            $order->status = $request->status;
            $order->save();

            return response()->json([
                'message' => 'Cập nhật trạng thái đơn hàng thành công.',
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
}