@extends('layout')

@section('content')
<h1>Tạo sản phẩm mới</h1>

@if ($errors->any())
    <ul>
        @foreach ($errors->all() as $error)
            <li style="color:red;">{{ $error }}</li>
        @endforeach
    </ul>
@endif

<form method="POST" action="{{ route('products.store') }}" enctype="multipart/form-data">
    @csrf
    <label>Tên:</label> <input type="text" name="name"><br>
    <label>Giá:</label> <input type="number" name="price"><br>
    <label>Tồn kho:</label> <input type="number" name="stock"><br>
    <label>Danh mục:</label>
    <select name="category_id">
        @foreach($categories as $category)
            <option value="{{ $category->id }}">{{ $category->name }}</option>
        @endforeach
    </select><br>
    <label>Hình ảnh:</label> <input type="file" name="thumbnail"><br>
    <label>Mô tả:</label><br><textarea name="description"></textarea><br>
    <button type="submit">Tạo</button>
</form>
@endsection
