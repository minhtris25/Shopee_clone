<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\ProductImage>
 */
class ProductImageFactory extends Factory
{
    public function definition()
    {
        return [
            'product_id' => \App\Models\Product::factory(), // Tạo product mới hoặc liên kết product hiện có
            'image_url' => fake()->imageUrl(800, 600, 'products', true),
        ];
    }
}
