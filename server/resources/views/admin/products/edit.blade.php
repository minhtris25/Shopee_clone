@extends('admin.layouts.app')

@section('title', 'Chỉnh sửa sản phẩm')

@section('content')
<div class="container mt-4">
    <h2>Chỉnh sửa sản phẩm</h2>

    <form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label>Tên sản phẩm</label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $product->name) }}" required>
        </div>

        <div class="mb-3">
            <label>Mô tả</label>
            <textarea name="description" class="form-control" rows="3">{{ old('description', $product->description) }}</textarea>
        </div>

        <div class="mb-3">
            <label>Giá</label>
            <input type="number" name="price" step="0.01" class="form-control" value="{{ old('price', $product->price) }}" required>
        </div>

        <div class="mb-3">
            <label>Số lượng</label>
            <input type="number" name="stock" class="form-control" value="{{ old('stock', $product->stock) }}" required>
        </div>

        <div class="mb-3">
            <label>Danh mục</label>
            <select name="category_id" class="form-control" required>
                @foreach($categories as $cat)
                    <option value="{{ $cat->id }}" {{ $product->category_id == $cat->id ? 'selected' : '' }}>
                        {{ $cat->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label>Ảnh đại diện</label>
            @if($product->thumbnail)
                <div class="mb-2">
                    <img src="{{ asset('storage/' . $product->thumbnail) }}" alt="Thumbnail" width="100">
                </div>
            @endif
            <input type="file" name="thumbnail" class="form-control">
        </div>

        <div class="mb-3">
            <label>Trạng thái</label>
            <select name="status" class="form-control" required>
                <option value="active" {{ $product->status == 'active' ? 'selected' : '' }}>Hoạt động</option>
                <option value="inactive" {{ $product->status == 'inactive' ? 'selected' : '' }}>Tạm ngưng</option>
            </select>
        </div>

        <button class="btn btn-primary">Cập nhật</button>
        <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">Quay lại</a>
    </form>
</div>
@endsection
