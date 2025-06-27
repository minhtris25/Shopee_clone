<?php
    use Illuminate\Support\Facades\Route;   
    use App\Http\Controllers\Api\HomeController;
    use App\Http\Controllers\Api\CartItemController;
    use App\Http\Controllers\Api\AuthController;


    use Illuminate\Http\Request;

    use App\Http\Controllers\Api\SellerProductController;
    use App\Http\Controllers\Api\ProductController;
    use App\Http\Controllers\Api\ReviewController;


// Product & Review routes
Route::prefix('products')->group(function () {
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('{id}', [ProductController::class, 'show']);
    Route::put('{id}', [ProductController::class, 'update']);
    Route::delete('{id}', [ProductController::class, 'destroy']);
    Route::get('{id}/reviews', [ReviewController::class, 'index']);
    Route::middleware('auth:sanctum')->post('{id}/reviews', [ReviewController::class, 'store']);
});

// Home routes
Route::prefix('home')->group(function () {
    Route::get('/', [HomeController::class, 'index']);
    Route::get('/banners', [HomeController::class, 'banners']);
    Route::get('/categories', [HomeController::class, 'categories']);
    Route::get('/flash-sale', [HomeController::class, 'flashSale']);
    Route::get('/top-selling', [HomeController::class, 'topSelling']);
    Route::get('/trending', [HomeController::class, 'trending']);
    Route::get('/recommend-by-category', [HomeController::class, 'recommendByCategory']);
});

  Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/seller/products', [SellerProductController::class, 'store']);
    Route::put('/seller/products/{id}', [SellerProductController::class, 'update']);
    Route::delete('/seller/products/{id}', [SellerProductController::class, 'destroy']);
});

    Route::get('/product/{id}', function ($id) {
        return App\Models\Product::findOrFail($id);
    });

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

// Cart routes (auth required)
Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    Route::post('/add', [CartItemController::class, 'add']);
    Route::delete('/remove', [CartItemController::class, 'remove']);
});

// Auth route
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});







