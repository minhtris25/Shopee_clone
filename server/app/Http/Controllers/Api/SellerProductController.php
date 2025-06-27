<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth; // <-- Thêm dòng này để sử dụng Auth

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
            'thumbnail'   => 'nullable|url',
            'status'      => 'in:active,inactive',
        ]);

        $product = Product::create([
            'seller_id'   => auth()->id(), // ai đăng nhập sẽ là người sở hữu sản phẩm
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'slug'        => $request->slug ?? Str::slug($request->name) . '-' . uniqid(),
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'thumbnail'   => $request->thumbnail,
            'status'      => $request->status ?? 'active',
        ]);

        return response()->json([
            'message' => 'Tạo sản phẩm thành công',
            'product' => $product
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
            'thumbnail'   => 'nullable|url',
            'status'      => 'in:active,inactive',
        ]);

        $product->update($request->only([
            'category_id', 'name', 'slug', 'description',
            'price', 'stock', 'thumbnail', 'status',
        ]));

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

        $product->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }
}