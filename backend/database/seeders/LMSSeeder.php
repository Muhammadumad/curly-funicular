<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LMSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Admin
        User::create([
            'name' => 'Admin Instructor',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // 2. Create Student
        User::create([
            'name' => 'John Student',
            'email' => 'student@test.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]);

        // 3. Course 1
        $course1 = Course::create([
            'title' => 'Mastering AI Agents with Python',
            'slug' => 'mastering-ai-agents-with-python',
            'description' => 'Learn to build and deploy advanced autonomous AI agents using Python.',
            'price' => 99.99,
            'is_published' => true,
        ]);

        Lesson::create([
            'course_id' => $course1->id,
            'title' => 'Introduction to AI Agents',
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'duration_in_seconds' => 300,
            'order_sequence' => 1,
        ]);

        Lesson::create([
            'course_id' => $course1->id,
            'title' => 'Building Your First Agent with LangChain',
            'video_url' => 'https://www.w3schools.com/html/movie.mp4',
            'duration_in_seconds' => 600,
            'order_sequence' => 2,
        ]);

        Lesson::create([
            'course_id' => $course1->id,
            'title' => 'Advanced Agent Tool Use',
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'duration_in_seconds' => 900,
            'order_sequence' => 3,
        ]);

        // 4. Course 2
        $course2 = Course::create([
            'title' => 'Generative AI Foundations',
            'slug' => 'generative-ai-foundations',
            'description' => 'Understand LLMs, diffusion models, and prompt engineering.',
            'price' => 49.99,
            'is_published' => true,
        ]);

        Lesson::create([
            'course_id' => $course2->id,
            'title' => 'What is Generative AI?',
            'video_url' => 'https://www.w3schools.com/html/movie.mp4',
            'duration_in_seconds' => 240,
            'order_sequence' => 1,
        ]);

        Lesson::create([
            'course_id' => $course2->id,
            'title' => 'Introduction to Large Language Models',
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'duration_in_seconds' => 480,
            'order_sequence' => 2,
        ]);

        Lesson::create([
            'course_id' => $course2->id,
            'title' => 'Mastering Prompt Engineering',
            'video_url' => 'https://www.w3schools.com/html/movie.mp4',
            'duration_in_seconds' => 720,
            'order_sequence' => 3,
        ]);
    }
}
