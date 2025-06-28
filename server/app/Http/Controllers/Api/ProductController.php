<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function recommendByCategory(Request $request)
    {
        $query = Product::with(['category', 'seller'])
                         ->where('status', 'active');

        // Xử lý sắp xếp
        $sortBy = $request->input('sort_by', 'lienQuan');
        switch ($sortBy) {
            case 'moiNhat':
                $query->orderBy('created_at', 'desc');
                break;
            case 'banChay':
                $query->orderBy('sold', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'lienQuan':
            default:
                $query->orderBy('id', 'desc');
                break;
        }

        // Phân trang
        $perPage = $request->input('per_page', 16);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }
    public function index()
    {
        $products = Product::with(['category', 'seller'])
        ->where('status', 'active') 
        ->get();
        return response()->json($products);
    }

    public function search(Request $request)
    {
        $keyword = $request->input('q');

        if (!$keyword) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu từ khóa tìm kiếm'
            ], 400);
        }

        $products = Product::with('category')
             ->where('status', 'active')
            ->where('name', 'LIKE', "%$keyword%")
            ->orWhereHas('category', function ($query) use ($keyword) {
                $query->where('name', 'LIKE', "%$keyword%");
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'thumbnail' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'seller'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'seller_id' => 'sometimes|exists:users,id',
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'thumbnail' => 'nullable|string',
            'status' => 'in:active,inactive'
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}

?>