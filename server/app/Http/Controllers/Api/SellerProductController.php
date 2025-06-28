<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SellerProductController extends Controller
{
    /**
     * Lấy danh sách sản phẩm của người bán hiện tại.
     * Yêu cầu xác thực bằng auth:sanctum.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Lấy người dùng hiện tại đã đăng nhập
        $user = Auth::user();

        // Lấy tất cả sản phẩm thuộc về người dùng này
        // Giả định mối quan hệ 'products' đã được định nghĩa trong User model
        // Hoặc bạn có thể truy vấn trực tiếp bảng products với seller_id
        $products = Product::where('seller_id', $user->id)->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'thumbnail'   => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status'      => 'in:active,inactive',
        ]);

        $thumbnailPath = null;
        // Xử lý và lưu trữ file ảnh nếu có
        if ($request->hasFile('thumbnail')) {
            $image = $request->file('thumbnail');
            // Tạo tên file duy nhất
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();

            // Lưu ảnh vào thư mục 'public/products' trong storage
            // Phương thức storeAs() sẽ trả về đường dẫn tương đối (ví dụ: 'public/products/ten_file.jpg')
            // Chúng ta chỉ cần lưu phần 'products/ten_file.jpg' vào database
            $path = $image->storeAs('public/products', $filename);
            
            // Cắt bỏ phần 'public/' để lưu đường dẫn tương đối 'products/ten_file.jpg'
            $thumbnailPath = Str::replaceFirst('public/', '', $path);
        }

        $product = Product::create([
            'seller_id'   => auth()->id(),
            'category_id' => $request->category_id,
            'name'        => $request->name,
            // Nếu slug không được cung cấp, tạo từ tên sản phẩm và thêm uniqid để đảm bảo duy nhất
            'slug'        => $request->slug ? Str::slug($request->slug) : Str::slug($request->name) . '-' . uniqid(),
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'thumbnail'   => $thumbnailPath, // Lưu đường dẫn đã xử lý (products/ten_file.jpg)
            'status'      => $request->status ?? 'active',
        ]);

        return response()->json([
            'message' => 'Tạo sản phẩm thành công',
            'product' => $product,
            // Không còn trả về asset($thumbnailPath) nữa, frontend sẽ tự xử lý
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // chỉ được sửa sản phẩm của chính mình
        $product = Product::where('id', $id)
                          ->where('seller_id', auth()->id())
                          ->firstOrFail();

        $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name'        => 'sometimes|string|max:255',
            'slug'        => ['sometimes', 'string', 'max:255', Rule::unique('products')->ignore($product->id)],
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'thumbnail'   => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status'      => 'in:active,inactive',
        ]);

        $dataToUpdate = $request->only([
            'category_id', 'name', 'slug', 'description',
            'price', 'stock', 'status',
        ]);

        $oldThumbnail = $product->thumbnail; // Lưu lại đường dẫn ảnh cũ để xóa nếu có ảnh mới

        // Xử lý và lưu trữ file ảnh nếu có trong request update
        if ($request->hasFile('thumbnail')) {
            $image = $request->file('thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/products', $filename);
            
            // Cắt bỏ phần 'public/' để lưu đường dẫn tương đối 'products/ten_file.jpg'
            $dataToUpdate['thumbnail'] = Str::replaceFirst('public/', '', $path);

            // Xóa ảnh cũ nếu nó tồn tại và không phải là ảnh mặc định (nếu có)
            if ($oldThumbnail) {
                // Chuyển đổi đường dẫn tương đối thành đường dẫn trong storage/app
                $oldStoragePath = 'public/' . $oldThumbnail; // Đảm bảo đúng định dạng
                if (Storage::exists($oldStoragePath)) {
                    Storage::delete($oldStoragePath);
                }
            }
        } elseif ($request->has('thumbnail') && $request->thumbnail === null) {
            // Trường hợp người dùng gửi thumbnail=null để xóa ảnh hiện tại
            if ($oldThumbnail) {
                $oldStoragePath = 'public/' . $oldThumbnail; // Đảm bảo đúng định dạng
                if (Storage::exists($oldStoragePath)) {
                    Storage::delete($oldStoragePath);
                }
            }
            $dataToUpdate['thumbnail'] = null;
        }


        // Nếu slug được cung cấp và trống, hoặc không được cung cấp khi cập nhật name
        if ($request->has('name') || ($request->has('slug') && $request->slug === null)) {
            if (!$request->has('slug') || $request->slug === null) {
                // Tạo slug mới nếu name thay đổi và slug không được cung cấp hoặc được set null
                $newSlug = Str::slug($request->name ?? $product->name);
                $originalSlug = $newSlug;
                $i = 1;
                while (Product::where('slug', $newSlug)->where('id', '!=', $product->id)->exists()) {
                    $newSlug = $originalSlug . '-' . $i++;
                }
                $dataToUpdate['slug'] = $newSlug;
            } else {
                // Nếu slug được cung cấp rõ ràng, dùng nó
                $dataToUpdate['slug'] = Str::slug($request->slug);
            }
        }


        $product->update($dataToUpdate);

        return response()->json([
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product
        ]);
    }

    public function destroy($id)
    {
        // chỉ được xóa sản phẩm của chính mình
        $product = Product::where('id', $id)
                          ->where('seller_id', auth()->id())
                          ->firstOrFail();

        // Xóa file ảnh liên quan trước khi xóa sản phẩm
        if ($product->thumbnail) {
            // Chuyển đổi đường dẫn tương đối thành đường dẫn trong storage/app
            $storagePath = 'public/' . $product->thumbnail; // Đảm bảo đúng định dạng
            if (Storage::exists($storagePath)) {
                Storage::delete($storagePath);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }
}
