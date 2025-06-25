<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shipping extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'tracking_code', 'shipping_provider', 'status'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
