<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Admin Panel')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f8f9fa;
        }

        .navbar {
            background-color: #FA5130 !important;
        }

        .navbar-brand {
            color: #fff
        }

        .btn-outline-light:hover {
            background-color: #fff;
            color: #FA5130;
        }

        .sidebar {
            background-color: rgb(44, 41, 41);
            min-height: 100vh;
            color: #fff;
        }

        .sidebar a {
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .sidebar .nav-link.active {
            background-color: #ffffff;
            color: #FA5130 !important;
            font-weight: bold;
            border-radius: 5px;
        }

        .btn-primary {
            background-color: #FA5130;
            border-color: #FA5130;
        }

        .btn-primary:hover {
            background-color: #e04624;
            border-color: #e04624;
        }

        .modal-header {
            background-color: #FA5130;
            color: white;
        }
    </style>

    @stack('styles')
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg px-4">
        <a class="navbar-brand fw-bold" href="{{ route('admin.dashboard') }}">Shopee Admin</a>
        <div class="ms-auto d-flex align-items-center">
            <button class="btn btn-sm btn-light me-2" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                <i class="bi bi-person-circle me-1"></i> {{ auth()->user()->name ?? 'Admin' }}
            </button>
            <form action="{{ route('admin.logout') }}" method="POST" class="d-inline">
                @csrf
                <button type="submit" class="btn btn-sm btn-outline-light"><i class="bi bi-box-arrow-right"></i> Đăng xuất</button>
            </form>
        </div>
    </nav>

    <!-- Layout -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar py-4 px-3">
                <h5 class="mb-4">Quản trị</h5>
                <ul class="nav flex-column">
                    <li class="nav-item mb-2">
                        <a href="{{ route('admin.dashboard') }}" class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                            <i class="bi bi-speedometer2"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="{{ route('admin.products.index') }}" class="nav-link {{ request()->routeIs('admin.products.*') ? 'active' : '' }}">
                            <i class="bi bi-box-seam"></i> Sản phẩm
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="{{ route('admin.users.index') }}" class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}">
                            <i class="bi bi-people"></i> Người dùng
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="{{ route('admin.orders.index') }}" class="nav-link {{ request()->routeIs('admin.orders.*') ? 'active' : '' }}">
                            <i class="bi bi-receipt"></i> Đơn hàng
                        </a>
                    </li>
                </ul>
            </div>

            <!-- Main content -->
            <div class="col-md-10 p-4">
                @yield('content')
            </div>
        </div>
    </div>

    <!-- Modal sửa thông tin -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form method="POST" action="{{ route('admin.profile.update') }}">
                @csrf
                @method('PATCH')

                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sửa thông tin</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                    </div>
                    <div class="modal-body">
                        @if(session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        @if($errors->any())
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    @foreach($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <div class="mb-3">
                            <label for="name" class="form-label">Họ tên</label>
                            <input type="text" class="form-control" name="name" value="{{ auth()->user()->name }}">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" name="email" value="{{ auth()->user()->email }}">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Mật khẩu mới (tuỳ chọn)</label>
                            <input type="password" class="form-control" name="password">
                        </div>
                        <div class="mb-3">
                            <label for="password_confirmation" class="form-label">Xác nhận mật khẩu</label>
                            <input type="password" class="form-control" name="password_confirmation">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                        <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
