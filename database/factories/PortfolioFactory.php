<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Portfolio>
 */
class PortfolioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $technologies = [
            ['Laravel', 'Vue.js', 'MySQL', 'TailwindCSS'],
            ['React', 'Node.js', 'MongoDB', 'Express'],
            ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
            ['Flutter', 'Dart', 'Firebase', 'REST API'],
            ['Python', 'Django', 'Redis', 'Docker'],
        ];

        $categories = ['Web App', 'Mobile App', 'API', 'Full Stack', 'Frontend'];

        return [
            'title' => fake()->catchPhrase(),
            'description' => fake()->paragraphs(2, true),
            'image' => null,
            'github_url' => fake()->optional(0.8)->url(),
            'live_url' => fake()->optional(0.6)->url(),
            'technologies' => fake()->randomElement($technologies),
            'category' => fake()->randomElement($categories),
            'featured' => fake()->boolean(30),
        ];
    }
}
