<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'message' => 'Hi, I saw your portfolio and I\'m really impressed with your work. We\'re looking for a Laravel developer for a project. Would you be interested in collaborating?',
                'status' => 'read',
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria.garcia@company.com',
                'message' => 'Hello! I\'m a recruiter at TechCorp and I\'d like to discuss a full-stack developer position with you. Please let me know if you\'re available for a call.',
                'status' => 'read',
            ],
            [
                'name' => 'Eko Prasetyo',
                'email' => 'eko.prasetyo@startup.id',
                'message' => 'Halo, saya dari startup lokal dan tertarik untuk mengajak kolaborasi untuk project mobile app. Bisa kita diskusikan lebih lanjut?',
                'status' => 'unread',
            ],
            [
                'name' => 'Lisa Chen',
                'email' => 'lisa.chen@design.co',
                'message' => 'I love the design of your personal website! Would you be open to sharing some insights about your development process? I\'m writing an article about developer portfolios.',
                'status' => 'unread',
            ],
            [
                'name' => 'Raka Mahendra',
                'email' => 'raka.dev@gmail.com',
                'message' => 'Mas, saya mahasiswa IT semester akhir. Boleh minta saran untuk membangun portfolio developer? Website mas jadi inspirasi saya. Terima kasih!',
                'status' => 'unread',
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }
    }
}
