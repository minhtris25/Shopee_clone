<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition()
    {
        return [
            'buyer_id' => \App\Models\User::factory(),
            'seller_id' => \App\Models\User::factory(),
            'order_code' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'shipping_address' => fake()->address(),
            'shipping_fee' => fake()->randomFloat(2, 0, 50),
            'total_price' => fake()->randomFloat(2, 50, 1000),
            'payment_method' => fake()->randomElement(['cod', 'shopeepay', 'bank_transfer']),
            'payment_status' => fake()->randomElement(['unpaid', 'paid']),
        ];
    }
}
