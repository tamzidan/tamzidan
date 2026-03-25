<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TechStack>
 */
class TechStackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];
        $proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

        return [
            'name' => fake()->unique()->word(),
            'category' => fake()->randomElement($categories),
            'icon' => null,
            'proficiency' => fake()->randomElement($proficiencies),
            'display_order' => fake()->numberBetween(1, 20),
            'is_active' => fake()->boolean(90),
        ];
    }
}
