<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition()
    {
        $name = fake()->words(3, true);
        return [
            'seller_id' => \App\Models\User::factory(),
            'category_id' => \App\Models\Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 10000),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'sold' => fake()->numberBetween(0, 50),
            'thumbnail' => fake()->imageUrl(640, 480, 'product', true),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}
