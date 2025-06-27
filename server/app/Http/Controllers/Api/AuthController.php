<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User; // Đảm bảo bạn đã import User model

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Thông tin đăng nhập không hợp lệ.'],
            ]);
        }

        $user = Auth::user();
        // Tạo Personal Access Token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user // Trả về thông tin người dùng
        ], 200);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            // 'password_confirmation' không cần required ở đây nếu đã dùng confirmed
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        // Tạo Personal Access Token sau khi đăng ký
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function me(Request $request)
    {
        // Trả về thông tin người dùng đã xác thực bằng token
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        // Xóa token hiện tại của người dùng
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Đăng xuất thành công']);
    }
}