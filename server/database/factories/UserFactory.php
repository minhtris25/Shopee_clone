<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'), // hoặc Hash::make('password')
            'phone' => fake()->optional()->phoneNumber(),
            'avatar_uri' => fake()->optional()->imageUrl(),
            'role' => fake()->randomElement(['buyer', 'seller', 'admin']),
            'address' => fake()->optional()->address(),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
