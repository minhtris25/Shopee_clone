<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Home Page']);
    }

    public function banners()
    {
        return response()->json(['message' => 'Banners']);
    }

    public function categories()
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function flashSale()
    {
        //
    }

    public function topSelling()
    {
        //
    }

    public function trending()
    {
        //
    }

    public function recommendByCategory(Request $request)
    {
        // Thêm bộ lọc trạng thái 'active' vào đây
        $query = Product::with(['category', 'seller'])->where('status', 'active');

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
        $perPage = $request->input('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    public function getRecommendByCategory()
    {
        //
    }
}
