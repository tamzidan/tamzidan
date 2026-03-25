<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $certificates = [
            [
                'title' => 'AWS Certified Solutions Architect',
                'issuer' => 'Amazon Web Services',
                'description' => 'Validates expertise in designing distributed systems and architectures on the AWS platform, covering compute, storage, database, and networking services.',
                'image_url' => null,
                'pdf_url' => null,
                'issue_date' => '2025-06-15',
            ],
            [
                'title' => 'Google Professional Cloud Developer',
                'issuer' => 'Google Cloud',
                'description' => 'Demonstrates proficiency in building scalable, highly available applications using Google Cloud technologies and best practices.',
                'image_url' => null,
                'pdf_url' => null,
                'issue_date' => '2025-03-20',
            ],
            [
                'title' => 'Meta Front-End Developer Professional Certificate',
                'issuer' => 'Meta (via Coursera)',
                'description' => 'Comprehensive front-end development program covering HTML, CSS, JavaScript, React, and responsive web design principles.',
                'image_url' => null,
                'pdf_url' => null,
                'issue_date' => '2024-11-10',
            ],
            [
                'title' => 'Laravel Certified Developer',
                'issuer' => 'Laravel',
                'description' => 'Official Laravel certification demonstrating deep knowledge of the Laravel framework, including Eloquent ORM, middleware, authentication, and testing.',
                'image_url' => null,
                'pdf_url' => null,
                'issue_date' => '2024-08-05',
            ],
            [
                'title' => 'Full Stack Web Development with React',
                'issuer' => 'The Hong Kong University (via Coursera)',
                'description' => 'Specialization covering server-side development with Node.js, front-end with React and Redux, and mobile development with React Native.',
                'image_url' => null,
                'pdf_url' => null,
                'issue_date' => '2024-02-28',
            ],
        ];

        foreach ($certificates as $certificate) {
            Certificate::create($certificate);
        }
    }
}
