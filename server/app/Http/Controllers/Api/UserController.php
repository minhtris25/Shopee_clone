<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import facade Auth

class UserController extends Controller
{
    /**
     * Display the authenticated user's account information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        // Lấy người dùng đã được xác thực thông qua Sanctum
        $user = Auth::user();

        // Kiểm tra nếu người dùng tồn tại (đã được xác thực)
        if ($user) {
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar_uri' => $user->avatar_uri,
                    'role' => $user->role,
                    'address' => $user->address,
                    'is_active' => (bool) $user->is_active, // Chuyển đổi sang boolean để đảm bảo kiểu dữ liệu
                    'created_at' => $user->created_at ? $user->created_at->toDateTimeString() : null,
                    'updated_at' => $user->updated_at ? $user->updated_at->toDateTimeString() : null,
                ]
            ], 200); // Trả về mã trạng thái 200 OK
        }

        // Trường hợp người dùng chưa được xác thực hoặc token không hợp lệ
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized. Please provide a valid authentication token.'
        ], 401); // Trả về mã trạng thái 401 Unauthorized
    }
}
