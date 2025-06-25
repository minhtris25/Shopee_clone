<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'description', 'discount_percent',
        'max_discount_value', 'min_order_value',
        'start_date', 'end_date', 'usage_limit', 'usage_count'
    ];
}
