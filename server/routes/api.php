<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\SellerProductController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserController; 


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// =========================================================================
// PUBLIC ROUTES (Các route không yêu cầu xác thực)
// =========================================================================

// Auth routes (Đăng nhập, Đăng ký)
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

// Home routes (Các API trang chủ: banners, categories, flashSale, v.v.)
Route::prefix('home')->group(function () {
    Route::get('/', [HomeController::class, 'index']);
    Route::get('/banners', [HomeController::class, 'banners']);
    Route::get('/categories', [HomeController::class, 'categories']);
    Route::get('/flash-sale', [HomeController::class, 'flashSale']);
    Route::get('/top-selling', [HomeController::class, 'topSelling']);
    Route::get('/trending', [HomeController::class, 'trending']);
    Route::get('/recommend-by-category', [HomeController::class, 'recommendByCategory']);
});

// Product routes (Public view: tìm kiếm, danh sách, chi tiết sản phẩm, đánh giá công khai)
Route::prefix('products')->group(function () {
    Route::get('/search', [ProductController::class, 'search']); // Tìm kiếm sản phẩm
    Route::get('/', [ProductController::class, 'index']);     // Lấy danh sách tất cả sản phẩm
    Route::get('{id}', [ProductController::class, 'show']);   // Xem chi tiết sản phẩm
    Route::get('{id}/reviews', [ReviewController::class, 'index']); // Xem danh sách đánh giá của một sản phẩm
});


// =========================================================================
// AUTHENTICATED ROUTES (Các route yêu cầu xác thực với Sanctum Token)
// =========================================================================
Route::middleware('auth:sanctum')->group(function () {

    // Lấy thông tin người dùng hiện tại (áp dụng cho cả buyer và seller)
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
    

    // ===============================================
    // Routes dành riêng cho NGƯỜI MUA
    // ===============================================

    // Cart routes (Các API liên quan đến giỏ hàng)
    // URL sẽ là /api/cart/...
    Route::prefix('cart')->group(function () {
        Route::post('/add', [CartItemController::class, 'add']); // Thêm sản phẩm vào giỏ hàng
        Route::delete('/remove', [CartItemController::class, 'remove']); // Xóa sản phẩm khỏi giỏ hàng
        // Bạn có thể thêm các route khác cho giỏ hàng như:
        // Route::get('/', [CartItemController::class, 'index']); // Xem giỏ hàng
        // Route::put('/update', [CartItemController::class, 'update']); // Cập nhật số lượng sản phẩm trong giỏ hàng
    });

    // Order routes (Các API liên quan đến đơn hàng của người mua)
    // URL sẽ là /api/orders/...
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);       // Lấy danh sách đơn hàng của người mua
        Route::post('/', [OrderController::class, 'store']);      // Tạo đơn hàng mới
        Route::get('{id}', [OrderController::class, 'show']);     // Xem chi tiết đơn hàng của người mua
        Route::post('{id}/cancel', [OrderController::class, 'cancel']); // Hủy đơn hàng (người mua)
        Route::post('{id}/confirm-delivery', [OrderController::class, 'confirmDelivery']); // Xác nhận đã nhận hàng (người mua)
        Route::post('{id}/complete-order', [OrderController::class, 'completeOrder']); // Người mua hoàn tất đơn hàng
        // Route updateStatus thường dành cho người bán/admin, nếu người mua không được phép thay đổi trạng thái, không đặt ở đây.
        // Route::put('{id}/status', [OrderController::class, 'updateStatus']);
    });

    // Review routes (Người mua tạo đánh giá)
    // URL sẽ là /api/products/{id}/reviews
    Route::post('products/{id}/reviews', [ReviewController::class, 'store']); // Gửi đánh giá cho một sản phẩm


    // ===============================================
    // Routes dành riêng cho NGƯỜI BÁN (có thể cần thêm middleware kiểm tra vai trò)
    // ===============================================

    // Seller Product routes (Các API quản lý sản phẩm của người bán)
    // URL sẽ là /api/seller/products/...
    Route::prefix('seller/products')->group(function () {
        Route::get('/', [SellerProductController::class, 'index']); // Lấy danh sách sản phẩm của người bán
        Route::post('/', [SellerProductController::class, 'store']); // Thêm sản phẩm mới
        Route::put('{id}', [SellerProductController::class, 'update']); // Cập nhật sản phẩm
        Route::delete('{id}', [SellerProductController::class, 'destroy']); // Xóa sản phẩm
    });

    // Các route CRUD sản phẩm này cũng có thể thuộc về quản trị viên hoặc người bán
    // (ví dụ: nếu ProductController quản lý chung và SellerProductController là quản lý riêng của seller)
    // URL sẽ là /api/products/...
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Nếu bạn muốn người bán có thể cập nhật trạng thái đơn hàng của họ, bạn có thể đặt nó ở đây
    // URL sẽ là /api/orders/{id}/status
    // Route::put('orders/{id}/status', [OrderController::class, 'updateStatus']); // Người bán/Admin cập nhật trạng thái đơn hàng
});

Route::middleware('auth:sanctum')->group(function () {
    // Route để lấy thông tin tài khoản của người dùng đã xác thực
    Route::get('/profile', [UserController::class, 'show']);

    // Bạn có thể thêm các route khác yêu cầu xác thực ở đây
    // Route::post('/logout', [LoginController::class, 'logout']);
});