<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartItemController;

Route::get('/', function () {
    return view('welcome');
});

Route::resource('products', ProductController::class);

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/cart', [CartItemController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartItemController::class, 'store'])->name('cart.store');
    Route::put('/cart/{id}', [CartItemController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{id}', [CartItemController::class, 'destroy'])->name('cart.destroy');

    // 🧹 Xóa toàn bộ giỏ hàng
    Route::delete('/cart', [CartItemController::class, 'clear'])->name('cart.clear');

    // 🔼🔽 Tăng / Giảm số lượng
    Route::post('/cart/{id}/increase', [CartItemController::class, 'increase'])->name('cart.increase');
    Route::post('/cart/{id}/decrease', [CartItemController::class, 'decrease'])->name('cart.decrease');

    // 💰 Tính tổng tiền riêng biệt
    Route::get('/cart/total', [CartItemController::class, 'total'])->name('cart.total');
});