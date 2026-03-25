<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\CommentReply;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comments = [
            [
                'name' => 'Budi Santoso',
                'message' => 'Website-nya keren banget! Desainnya clean dan profesional. Sukses terus ya!',
                'photo' => null,
                'likes' => 12,
                'is_visible' => true,
                'replies' => [
                    ['name' => 'Admin', 'message' => 'Terima kasih banyak, Budi! Senang kamu suka desainnya 😊', 'is_admin' => true],
                ],
            ],
            [
                'name' => 'Sarah Putri',
                'message' => 'Portfolionya inspiratif! Saya suka project e-commerce-nya. Tech stack-nya juga mantap.',
                'photo' => null,
                'likes' => 8,
                'is_visible' => true,
                'replies' => [
                    ['name' => 'Admin', 'message' => 'Makasih Sarah! Project e-commerce itu memang salah satu favorit saya juga.', 'is_admin' => true],
                    ['name' => 'Andi Wijaya', 'message' => 'Setuju! E-commerce project-nya emang keren.', 'is_admin' => false],
                ],
            ],
            [
                'name' => 'Rizky Pratama',
                'message' => 'Bro, animasinya smooth banget! Pake library apa? Pengen belajar juga nih.',
                'photo' => null,
                'likes' => 15,
                'is_visible' => true,
                'replies' => [
                    ['name' => 'Admin', 'message' => 'Thanks Rizky! Saya pakai kombinasi CSS animations dan anime.js untuk animasinya.', 'is_admin' => true],
                ],
            ],
            [
                'name' => 'Diana Kusuma',
                'message' => 'Sertifikasinya banyak! Salut sama dedikasinya untuk terus belajar. Keep it up! 💪',
                'photo' => null,
                'likes' => 6,
                'is_visible' => true,
                'replies' => [],
            ],
            [
                'name' => 'Ahmad Fauzi',
                'message' => 'Saya tertarik dengan tech stack yang dipakai. Laravel + Vue.js memang kombinasi yang solid.',
                'photo' => null,
                'likes' => 10,
                'is_visible' => true,
                'replies' => [
                    ['name' => 'Admin', 'message' => 'Betul sekali! Laravel dan Vue.js memang saling melengkapi dengan baik.', 'is_admin' => true],
                ],
            ],
            [
                'name' => 'Mega Lestari',
                'message' => 'UI/UX-nya bagus! Navigasinya juga gampang dipakai. Responsive di HP juga.',
                'photo' => null,
                'likes' => 4,
                'is_visible' => true,
                'replies' => [],
            ],
            [
                'name' => 'Deni Setiawan',
                'message' => 'Mau tanya dong, project task manager-nya open source ga? Pengen contribute.',
                'photo' => null,
                'likes' => 3,
                'is_visible' => true,
                'replies' => [
                    ['name' => 'Admin', 'message' => 'Halo Deni! Iya, itu open source. Silakan cek repo GitHub-nya dan feel free untuk contribute!', 'is_admin' => true],
                ],
            ],
            [
                'name' => 'Fitri Handayani',
                'message' => 'Wah keren! Sekalian mau nanya, ada plan untuk bikin tutorial ga? Saya pengen belajar Laravel juga.',
                'photo' => null,
                'likes' => 7,
                'is_visible' => true,
                'replies' => [
                    ['name' => 'Admin', 'message' => 'Terima kasih Fitri! Ada rencana buat bikin series tutorial di YouTube. Stay tuned!', 'is_admin' => true],
                ],
            ],
        ];

        foreach ($comments as $commentData) {
            $replies = $commentData['replies'];
            unset($commentData['replies']);

            $comment = Comment::create($commentData);

            foreach ($replies as $reply) {
                $comment->replies()->create($reply);
            }
        }
    }
}
