<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('buyer')->latest()->paginate(10);

        return view('admin.orders.index', compact('orders'));
    }

        public function show(Order $order)
    {
        $order->load('buyer', 'items.product'); // nếu có quan hệ items và product
        return view('admin.orders.show', compact('order'));
    }

        public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,completed,cancelled',
        ]);

        $order->status = $validated['status'];
        $order->save();

        return back()->with('success', 'Cập nhật trạng thái đơn hàng thành công!');
    }

}
