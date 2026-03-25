<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $portfolios = [
            [
                'title' => 'E-Commerce Platform',
                'description' => 'A full-featured e-commerce platform with product management, shopping cart, payment gateway integration, and order tracking. Built with modern technologies for optimal performance and user experience.',
                'image' => null,
                'github_url' => 'https://github.com/tamzidan/ecommerce-platform',
                'live_url' => 'https://ecommerce-demo.example.com',
                'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'TailwindCSS', 'Stripe'],
                'category' => 'Web/Apps',
                'featured' => true,
            ],
            [
                'title' => 'Task Management App',
                'description' => 'A collaborative task management application with real-time updates, drag-and-drop kanban boards, team workspaces, and deadline notifications. Supports multiple project workflows.',
                'image' => null,
                'github_url' => 'https://github.com/tamzidan/task-manager',
                'live_url' => 'https://tasks-demo.example.com',
                'technologies' => ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Express'],
                'category' => 'Web/Apps',
                'featured' => true,
            ],
            [
                'title' => 'Weather Dashboard',
                'description' => 'A beautiful weather dashboard that displays current conditions, 7-day forecasts, and weather maps. Integrates with OpenWeatherMap API and supports location-based weather data.',
                'image' => null,
                'github_url' => 'https://github.com/tamzidan/weather-dashboard',
                'live_url' => 'https://weather-demo.example.com',
                'technologies' => ['Next.js', 'TypeScript', 'TailwindCSS', 'OpenWeather API'],
                'category' => 'Web/Apps',
                'featured' => false,
            ],
            [
                'title' => 'RESTful API Service',
                'description' => 'A robust RESTful API service with JWT authentication, rate limiting, comprehensive documentation, and automated testing. Designed for scalability and maintainability.',
                'image' => null,
                'github_url' => 'https://github.com/tamzidan/rest-api-service',
                'live_url' => null,
                'technologies' => ['Laravel', 'PostgreSQL', 'Redis', 'Docker', 'Swagger'],
                'category' => 'Web/Apps',
                'featured' => false,
            ],
            [
                'title' => 'Mobile Fitness Tracker',
                'description' => 'A cross-platform mobile fitness tracking app with workout logging, progress charts, meal planning, and social features. Syncs data across devices in real-time.',
                'image' => null,
                'github_url' => 'https://github.com/tamzidan/fitness-tracker',
                'live_url' => null,
                'technologies' => ['Flutter', 'Dart', 'Firebase', 'REST API', 'Google Fit API'],
                'category' => 'Web/Apps',
                'featured' => true,
            ],
        ];

        foreach ($portfolios as $portfolio) {
            Portfolio::create($portfolio);
        }
    }
}
