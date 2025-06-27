<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalProducts = Product::count();
        $totalUsers    = User::count();
        $totalOrders   = Order::count();

        // Dữ liệu biểu đồ: số lượng đơn hàng mỗi tháng (12 tháng gần nhất)
        $ordersByMonth = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');

        // Chuẩn hoá dữ liệu về dạng đủ 12 tháng
        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = $ordersByMonth[$i] ?? 0;
        }

        return view('admin.dashboard', compact(
            'totalProducts', 'totalUsers', 'totalOrders', 'chartData'
        ));
    }
}
