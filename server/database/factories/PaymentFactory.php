<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    public function definition()
    {
        return [
            'order_id' => \App\Models\Order::factory()->create()->id,
            'payment_method' => $this->faker->randomElement(['cod', 'shopeepay', 'bank_transfer']),
            'amount' => $this->faker->randomFloat(2, 10, 10000),
            'payment_status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'paid_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
