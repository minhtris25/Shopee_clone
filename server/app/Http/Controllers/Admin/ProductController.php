<?php

namespace App\Http\Controllers\Admin;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'thumbnail'   => 'nullable|image|max:2048',
            'category_id' => 'required|integer|exists:categories,id',
            'status'      => 'required|in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['seller_id'] = auth()->id(); // Hoặc bạn có thể dùng mặc định là 1
        $validated['sold'] = 0;

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Thêm sản phẩm thành công!');
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'        => 'required|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'thumbnail'   => 'nullable|image|max:2048',
            'category_id' => 'required|integer|exists:categories,id',
            'status'      => 'required|in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Cập nhật sản phẩm thành công!');
    }

        public function destroy(Product $product)
    {
        // Nếu có ảnh cũ thì có thể xoá ảnh ở đây nếu muốn
        // Storage::delete('public/' . $product->thumbnail);

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Xoá sản phẩm thành công!');
    }

}
