<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SellerProductController extends Controller
{
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
