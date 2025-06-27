@extends('admin.layouts.app')

@section('content')
<div class="container mt-4">
    <h2>Thêm sản phẩm</h2>

    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $err)
                    <li>{{ $err }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label>Tên sản phẩm</label>
            <input type="text" name="name" class="form-control" required value="{{ old('name') }}">
        </div>

        <div class="mb-3">
            <label>Mô tả</label>
            <textarea name="description" class="form-control">{{ old('description') }}</textarea>
        </div>

        <div class="mb-3">
            <label>Giá</label>
            <input type="number" name="price" step="0.01" class="form-control" required value="{{ old('price') }}">
        </div>

        <div class="mb-3">
            <label>Số lượng</label>
            <input type="number" name="stock" class="form-control" required value="{{ old('stock') }}">
        </div>

        <div class="mb-3">
            <label>Danh mục</label>
            <select name="category_id" class="form-control" required>
                @foreach($categories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label>Ảnh sản phẩm</label>
            <input type="file" name="thumbnail" class="form-control">
        </div>

        <div class="mb-3">
            <label>Trạng thái</label>
            <select name="status" class="form-control" required>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
            </select>
        </div>

        <button class="btn btn-primary">Thêm</button>
    </form>
</div>
@endsection
