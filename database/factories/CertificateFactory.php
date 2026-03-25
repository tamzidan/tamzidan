<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certificate>
 */
class CertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issuers = ['Google', 'Meta', 'AWS', 'Microsoft', 'Coursera', 'Udemy', 'freeCodeCamp', 'HackerRank'];

        return [
            'title' => fake()->bs() . ' Certificate',
            'issuer' => fake()->randomElement($issuers),
            'description' => fake()->sentence(10),
            'image_url' => null,
            'pdf_url' => null,
            'issue_date' => fake()->dateTimeBetween('-3 years', 'now'),
        ];
    }
}
