<?php

namespace Database\Seeders;

use App\Models\TechStack;
use Illuminate\Database\Seeder;

class TechStackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techStacks = [
            // Frontend
            ['name' => 'HTML5', 'category' => 'Frontend', 'icon' => 'html5', 'proficiency' => 'Expert', 'display_order' => 1, 'is_active' => true],
            ['name' => 'CSS3', 'category' => 'Frontend', 'icon' => 'css3', 'proficiency' => 'Expert', 'display_order' => 2, 'is_active' => true],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'icon' => 'javascript', 'proficiency' => 'Advanced', 'display_order' => 3, 'is_active' => true],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'icon' => 'typescript', 'proficiency' => 'Intermediate', 'display_order' => 4, 'is_active' => true],
            ['name' => 'Vue.js', 'category' => 'Frontend', 'icon' => 'vuejs', 'proficiency' => 'Advanced', 'display_order' => 5, 'is_active' => true],
            ['name' => 'React', 'category' => 'Frontend', 'icon' => 'react', 'proficiency' => 'Intermediate', 'display_order' => 6, 'is_active' => true],
            ['name' => 'TailwindCSS', 'category' => 'Frontend', 'icon' => 'tailwindcss', 'proficiency' => 'Advanced', 'display_order' => 7, 'is_active' => true],

            // Backend
            ['name' => 'PHP', 'category' => 'Backend', 'icon' => 'php', 'proficiency' => 'Advanced', 'display_order' => 8, 'is_active' => true],
            ['name' => 'Laravel', 'category' => 'Backend', 'icon' => 'laravel', 'proficiency' => 'Advanced', 'display_order' => 9, 'is_active' => true],
            ['name' => 'Node.js', 'category' => 'Backend', 'icon' => 'nodejs', 'proficiency' => 'Intermediate', 'display_order' => 10, 'is_active' => true],
            ['name' => 'Python', 'category' => 'Backend', 'icon' => 'python', 'proficiency' => 'Intermediate', 'display_order' => 11, 'is_active' => true],

            // Database
            ['name' => 'MySQL', 'category' => 'Database', 'icon' => 'mysql', 'proficiency' => 'Advanced', 'display_order' => 12, 'is_active' => true],
            ['name' => 'PostgreSQL', 'category' => 'Database', 'icon' => 'postgresql', 'proficiency' => 'Intermediate', 'display_order' => 13, 'is_active' => true],
            ['name' => 'MongoDB', 'category' => 'Database', 'icon' => 'mongodb', 'proficiency' => 'Intermediate', 'display_order' => 14, 'is_active' => true],

            // DevOps & Tools
            ['name' => 'Git', 'category' => 'Tools', 'icon' => 'git', 'proficiency' => 'Advanced', 'display_order' => 15, 'is_active' => true],
            ['name' => 'Docker', 'category' => 'DevOps', 'icon' => 'docker', 'proficiency' => 'Intermediate', 'display_order' => 16, 'is_active' => true],
            ['name' => 'Linux', 'category' => 'DevOps', 'icon' => 'linux', 'proficiency' => 'Intermediate', 'display_order' => 17, 'is_active' => true],
        ];

        foreach ($techStacks as $techStack) {
            TechStack::create($techStack);
        }
    }
}
