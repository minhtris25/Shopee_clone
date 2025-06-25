<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartItem extends Model
{
    protected $fillable = [
        'user_id', 'product_id', 'quantity'
    ];
}
