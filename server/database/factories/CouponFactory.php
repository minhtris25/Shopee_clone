<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Coupon>
 */
class CouponFactory extends Factory
{
    public function definition()
    {
        $startDate = fake()->dateTimeBetween('-1 month', '+1 week');
        $endDate = fake()->dateTimeBetween($startDate, '+1 month');

        return [
            'code' => strtoupper(Str::random(8)),
            'description' => fake()->optional()->sentence(),
            'discount_percent' => fake()->numberBetween(0, 50),
            'max_discount_value' => fake()->optional()->randomFloat(2, 10, 200),
            'min_order_value' => fake()->optional()->randomFloat(2, 20, 500),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'usage_limit' => fake()->numberBetween(1, 100),
            'usage_count' => fake()->numberBetween(0, 50),
        ];
    }
}
