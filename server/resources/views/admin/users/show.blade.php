@extends('admin.layouts.app')

@section('title', 'Chi tiết người dùng')

@section('content')
<div class="container mt-4">
    <h2>Thông tin người dùng</h2>

    {{-- Thông báo --}}
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <div class="card">
        <div class="card-body">
            <p><strong>ID:</strong> {{ $user->id }}</p>
            <p><strong>Họ tên:</strong> {{ $user->name }}</p>
            <p><strong>Email:</strong> {{ $user->email }}</p>
            <p><strong>Điện thoại:</strong> {{ $user->phone ?? 'Không có' }}</p>
            <p><strong>Địa chỉ:</strong> {{ $user->address ?? 'Không có' }}</p>
            
            <p><strong>Quyền hiện tại:</strong> 
                <span class="badge bg-secondary text-uppercase">{{ $user->role }}</span>
            </p>

            {{-- Form thay đổi quyền --}}
            <form action="{{ route('admin.users.updateRole', $user->id) }}" method="POST" class="d-inline-block mt-2">
                @csrf
                @method('PATCH')

                <label for="role"><strong>Thay đổi quyền:</strong></label>
                <div class="input-group" style="max-width: 300px;">
                    <select name="role" id="role" class="form-select">
                        <option value="buyer" {{ $user->role == 'buyer' ? 'selected' : '' }}>Người dùng</option>
                        <option value="seller" {{ $user->role == 'seller' ? 'selected' : '' }}>Người bán</option>
                        <option value="admin" {{ $user->role == 'admin' ? 'selected' : '' }}>Quản trị</option>
                    </select>
                    <button type="submit" class="btn btn-primary">Lưu</button>
                </div>
            </form>

            <p class="mt-3"><strong>Trạng thái:</strong>
                @if($user->is_active)
                    <span class="badge bg-success">Hoạt động</span>
                @else
                    <span class="badge bg-danger">Đã khoá</span>
                @endif
            </p>

            {{-- Ảnh đại diện --}}
            @if($user->avatar_uri)
                <p><strong>Ảnh đại diện:</strong><br>
                    <img src="{{ asset('storage/' . $user->avatar_uri) }}" width="100">
                </p>
            @endif
        </div>
    </div>

    <div class="mt-3 d-flex gap-2">
        {{-- Nút khoá/mở tài khoản --}}
        <form action="{{ route('admin.users.toggle', $user->id) }}" method="POST"
              onsubmit="return confirm('Bạn có chắc chắn muốn {{ $user->is_active ? 'khoá' : 'mở lại' }} tài khoản này?');">
            @csrf
            @method('PATCH')
            <button class="btn btn-{{ $user->is_active ? 'danger' : 'success' }}">
                {{ $user->is_active ? 'Khoá tài khoản' : 'Mở tài khoản' }}
            </button>
        </form>

        {{-- Quay lại danh sách --}}
        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Quay lại danh sách</a>
    </div>
</div>
@endsection
