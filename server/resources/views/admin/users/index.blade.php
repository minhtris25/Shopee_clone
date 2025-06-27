@extends('admin.layouts.app')

@section('title', 'Danh sách người dùng')

@section('content')
<div class="container mt-4">
    <h2>Danh sách người dùng</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <form action="{{ route('admin.users.index') }}" method="GET" class="mb-3 d-flex" style="max-width: 400px;">
    <input type="text" name="search" value="{{ request('search') }}"
           class="form-control me-2" placeholder="Tìm theo tên hoặc email...">
    <button type="submit" class="btn btn-primary">Tìm kiếm</button>
    </form>


    <table class="table table-bordered table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th width="150">Hành động</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>
                        @if($user->is_active ?? true)
                            <span class="badge bg-success">Hoạt động</span>
                        @else
                            <span class="badge bg-danger">Đã khoá</span>
                        @endif
                    </td>
                    <td>{{ $user->created_at->format('d/m/Y') }}</td>
                    <td>
                        <a href="{{ route('admin.users.show', $user->id) }}" class="btn btn-sm btn-info">Xem</a>
                        {{-- Nút khoá/mở sẽ thêm sau --}}
                    </td>
                </tr>
            @empty
                <tr><td colspan="6" class="text-center">Không có người dùng nào</td></tr>
            @endforelse
        </tbody>
    </table>

        {{ $users->links('pagination::bootstrap-5') }}
</div>
@endsection
