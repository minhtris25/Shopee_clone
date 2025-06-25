<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Shipping>
 */
class ShippingFactory extends Factory
{
    public function definition()
    {
        return [
            'order_id' => \App\Models\Order::factory(),
            'tracking_code' => strtoupper(fake()->bothify('TRK####???')), // ví dụ: TRK1234ABC
            'shipping_provider' => fake()->randomElement(['FedEx', 'DHL', 'UPS', 'GiaoHangNhanh', 'Viettel Post']),
            'status' => fake()->randomElement(['pending', 'in_transit', 'delivered', 'cancelled']),
        ];
    }
}
