@extends('layout')

@section('content')
<h1>Danh sách sản phẩm</h1>
<a href="{{ route('products.create') }}">Thêm sản phẩm</a>

@if (session('success'))
    <p style="color:green;">{{ session('success') }}</p>
@endif

<table border="1" cellpadding="10">
    <tr>
        <th>Tên</th>
        <th>Giá</th>
        <th>Tồn kho</th>
        <th>Danh mục</th>
        <th>Ảnh</th>
        <th>Thao tác</th>
    </tr>
    @foreach($products as $product)
    <tr>
        <td>{{ $product->name }}</td>
        <td>{{ number_format($product->price, 0) }} đ</td>
        <td>{{ $product->stock }}</td>
        <td>{{ $product->category->name }}</td>
        <td>
            @if($product->thumbnail)
                <img src="{{ asset('storage/' . $product->thumbnail) }}" width="80">
            @endif
        </td>
        <td><!-- thêm sửa/xóa nếu muốn --></td>
    </tr>
    @endforeach
</table>
@endsection
