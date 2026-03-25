<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            PortfolioSeeder::class,
            CertificateSeeder::class,
            TechStackSeeder::class,
            SocialMediaSeeder::class,
            CommentSeeder::class,
            ContactMessageSeeder::class,
        ]);
    }
}
