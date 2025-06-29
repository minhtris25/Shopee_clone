@extends('admin.layouts.app')

@section('title', 'Chi tiết đơn hàng')

@section('content')
<div class="container mt-4">
    <h2>Chi tiết đơn hàng #{{ $order->id }}</h2>

    {{-- Thông báo --}}
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <p><strong>Người mua:</strong> {{ $order->buyer->name ?? 'N/A' }} ({{ $order->buyer->email ?? 'Không có email' }})</p>
    <p><strong>Ngày đặt:</strong> {{ $order->created_at->format('d/m/Y H:i') }}</p>
    <p><strong>Trạng thái hiện tại:</strong>
        @if($order->status == 'pending')
            <span class="badge bg-warning">Chờ xử lý</span>
        @elseif($order->status == 'processing')
            <span class="badge bg-primary">Đang xử lý</span>
        @elseif($order->status == 'shipped')
            <span class="badge bg-success">Đã giao</span>
        @elseif($order->status == 'delivered')
            <span class="badge bg-success">Đã Hoàn Thành Đơn Hàng</span>
        @elseif($order->status == 'cancelled')
            <span class="badge bg-danger">Đã huỷ</span>
        @endif
    </p>
    <p><strong>Tổng tiền:</strong> {{ number_format($order->total_price) }}đ</p>

    {{-- Form cập nhật trạng thái --}}
    <form action="{{ route('admin.orders.updateStatus', $order->id) }}" method="POST" class="mt-3">
        @csrf
        @method('PATCH')

        <label for="status"><strong>Cập nhật trạng thái:</strong></label>
        <div class="input-group" style="max-width: 300px;">
            <select name="status" id="status" class="form-select">
                <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Chờ xử lý</option>
                <option value="processing" {{ $order->status == 'processing' ? 'selected' : '' }}>Đang xử lý</option>
                <option value="shipped" {{ $order->status == 'shipped' ? 'selected' : '' }}>Đã giao</option>
                <option value="delivered" {{ $order->status == 'delivered' ? 'selected' : '' }}>Đã hoàn thành</option>
                <option value="cancelled" {{ $order->status == 'cancelled' ? 'selected' : '' }}>Đã huỷ</option>
            </select>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
        </div>
    </form>

    <h4 class="mt-4">Sản phẩm</h4>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Tổng</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->name ?? 'Sản phẩm đã xoá' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ number_format($item->price) }}đ</td>
                    <td>{{ number_format($item->price * $item->quantity) }}đ</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary mt-3">Quay lại</a>
</div>
@endsection
