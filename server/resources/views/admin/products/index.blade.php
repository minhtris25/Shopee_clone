@extends('admin.layouts.app')

@section('title', 'Danh sách sản phẩm')

@section('content')
<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Danh sách sản phẩm</h2>
        <a href="{{ route('admin.products.create') }}" class="btn btn-success">+ Thêm sản phẩm</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered table-hover align-middle">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Ngày tạo</th>
                <th width="150">Hành động</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $product)
                <tr>
                    <td>{{ $product->id }}</td>
                    <td>{{ $product->name }}</td>
                    <td>{{ number_format($product->price, 0, ',', '.') }}đ</td>
                    <td>{{ $product->stock }}</td>
                    <td>{{ optional($product->created_at)->format('d/m/Y') }}</td>
                    <td>
                        <a href="{{ route('admin.products.edit', $product->id) }}" class="btn btn-sm btn-primary">Sửa</a>
                        <form action="{{ route('admin.products.destroy', $product->id) }}" method="POST" class="d-inline-block" 
                            onsubmit="return confirm('Bạn có chắc chắn muốn xoá sản phẩm này không?');">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">Xoá</button>
                        </form>

                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Không có sản phẩm nào</td>
                </tr>
            @endforelse
        </tbody>
    </table>

        {{ $products->links('pagination::bootstrap-5') }}
    
</div>
@endsection
