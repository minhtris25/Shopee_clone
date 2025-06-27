@extends('admin.layouts.app')

@section('title', 'Danh sách đơn hàng')

@section('content')
<div class="container mt-4">
    <h2 class="mb-4">Danh sách đơn hàng</h2>

    <table class="table table-bordered table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Người mua</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
                <tr>
                    <td>{{ $order->id }}</td>
                    <td>{{ $order->buyer->name ?? 'N/A' }}</td>
                    <td>{{ number_format($order->total_price) }}đ</td>
                    <td>
                        @if($order->status == 'pending')
                            <span class="badge bg-warning">Chờ xử lý</span>
                        @elseif($order->status == 'processing')
                            <span class="badge bg-primary">Đang xử lý</span>
                        @elseif($order->status == 'shipped')
                            <span class="badge bg-success">Đã giao</span>
                        @elseif($order->status == 'cancelled')
                            <span class="badge bg-danger">Đã huỷ</span>
                        @endif
                    </td>
                    <td>{{ $order->created_at->format('d/m/Y') }}</td>
                    <td>
                        <a href="{{ route('admin.orders.show', $order->id) }}" class="btn btn-sm btn-info">Xem</a>
                    </td>
                </tr>
            @empty
                <tr><td colspan="6">Không có đơn hàng nào</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $orders->links('pagination::bootstrap-5') }}
</div>
@endsection
