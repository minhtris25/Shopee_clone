<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController as ApiProductController;
use App\Http\Controllers\CartItemController;

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.post');

    Route::middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

        Route::get('/products', [AdminProductController::class, 'index'])->name('admin.products.index');
        Route::get('/products/create', [AdminProductController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [AdminProductController::class, 'store'])->name('admin.products.store');

        // Hiển thị form chỉnh sửa
        Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('admin.products.edit');

        // Xử lý cập nhật sản phẩm
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');

        //Xóa sản phẩm
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

        // Người dùng
        Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');

        Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show');

        Route::patch('/users/{user}/toggle', [AdminUserController::class, 'toggleStatus'])->name('admin.users.toggle');

        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.updateRole');

        // Đơn hàng
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');

        //profile admin
        Route::get('/profile', [AdminAuthController::class, 'editProfile'])->name('admin.profile.edit');
        Route::patch('/profile', [AdminAuthController::class, 'updateProfile'])->name('admin.profile.update');


    });
});


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