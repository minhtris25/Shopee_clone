<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;


class UserController extends Controller
{
        public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(10)->withQueryString(); // giữ query khi phân trang

        return view('admin.users.index', compact('users', 'search'));
    }


    public function show(\App\Models\User $user)
    {
        return view('admin.users.show', compact('user'));
    }

    public function toggleStatus(User $user)
    {
        // Không cho admin tự khoá mình
        if (auth()->id() == $user->id) {
            return back()->with('error', 'Bạn không thể tự khoá tài khoản của chính mình!');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return back()->with('success', 'Tài khoản đã được ' . ($user->is_active ? 'mở lại' : 'khoá') . ' thành công.');
    }

        public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:buyer,seller,admin',
        ]);

        // Không cho admin tự hạ cấp chính mình
        if ($user->id === auth()->id() && $validated['role'] !== 'admin') {
            return back()->with('error', 'Bạn không thể thay đổi quyền của chính mình!');
        }

        $user->role = $validated['role'];
        $user->save();

        return back()->with('success', 'Cập nhật quyền thành công!');
    }


}
