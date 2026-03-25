<?php

namespace Database\Seeders;

use App\Models\SocialMedia;
use Illuminate\Database\Seeder;

class SocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialMedias = [
            [
                'platform' => 'GitHub',
                'name' => 'tamzidan',
                'url' => 'https://github.com/tamzidan',
                'icon' => 'github',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'platform' => 'LinkedIn',
                'name' => 'Tamzidan Mahdiyin',
                'url' => 'https://linkedin.com/in/tamzidan',
                'icon' => 'linkedin',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'platform' => 'Twitter',
                'name' => '@tamzidan',
                'url' => 'https://twitter.com/tamzidan',
                'icon' => 'twitter',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'platform' => 'Instagram',
                'name' => '@tamzidan',
                'url' => 'https://instagram.com/tamzidan',
                'icon' => 'instagram',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'platform' => 'YouTube',
                'name' => 'Tamzidan Dev',
                'url' => 'https://youtube.com/@tamzidan',
                'icon' => 'youtube',
                'display_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($socialMedias as $socialMedia) {
            SocialMedia::create($socialMedia);
        }
    }
}
