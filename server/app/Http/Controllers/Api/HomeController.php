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

    public function recommendByCategory()
    {
        // Trả về tất cả sản phẩm, hoặc giới hạn số lượng
        return response()->json(Product::paginate(8));
    }

    public function getRecommendByCategory()
    {
        //  
    }
}

