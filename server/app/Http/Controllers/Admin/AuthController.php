<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('admin.auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            if (auth()->user()->role !== 'admin') {
                Auth::logout();
                return back()->with('error', 'Bạn không có quyền truy cập');
            }

            return redirect()->route('admin.dashboard');
        }

        return back()->with('error', 'Thông tin không hợp lệ');
    }

        public function logout(Request $request)
    {
        auth()->logout();
        return redirect()->route('admin.login');
    }

        public function editProfile()
    {
        $user = auth()->user();
        return view('admin.auth.profile', compact('user'));
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
        ]);

        $user->name  = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Cập nhật thông tin thành công!');
    }

}
