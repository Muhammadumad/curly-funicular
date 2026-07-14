<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Module;
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
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin Instructor',
                'password' => Hash::make('AdminPassword123!'),
                'role' => 'admin',
            ]
        );

        // 2. Create Student
        User::updateOrCreate(
            ['email' => 'student@test.com'],
            [
                'name' => 'John Student',
                'password' => Hash::make('password123'),
                'role' => 'student',
            ]
        );

        // 3. Create the Main Course
        $course = Course::updateOrCreate(
            ['slug' => '28-day-ai-challenge'],
            [
                'title' => 'AI Growth Academy — 28-Day AI Challenge',
                'description' => 'Master AI in 28 days through scenario-driven, mission-based challenges. Progress from survival-level basics to full automation workflows.',
                'price' => 99.00,
                'is_published' => true,
            ]
        );

        $dummyVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

        // 4. Modules and Lessons Structure
        $curriculum = [
            [
                'title' => 'Level 1: AI Survival',
                'duration' => '2h 35m',
                'lessons' => [
                    ['id' => 'day-0', 'title' => 'Day 0: Onboarding Quiz', 'duration' => '2:00'],
                    ['id' => 'day-1', 'title' => 'Day 1: Your AI Assistant', 'duration' => '15:00'],
                    ['id' => 'day-2', 'title' => 'Day 2: Inbox Zero', 'duration' => '15:00'],
                    ['id' => 'day-3', 'title' => 'Day 3: The Report Due Today', 'duration' => '20:00'],
                    ['id' => 'day-4', 'title' => 'Day 4: Understand This 100-Page PDF', 'duration' => '15:00'],
                    ['id' => 'day-5', 'title' => 'Day 5: Prompt Engineering', 'duration' => '15:00'],
                    ['id' => 'day-6', 'title' => 'Day 6: Organize My Life', 'duration' => '15:00'],
                    ['id' => 'day-7', 'title' => 'Day 7: Weekend Challenge — Replace One Hour', 'duration' => '30:00'],
                ]
            ],
            [
                'title' => 'Level 2: AI Professional',
                'duration' => '3h 00m',
                'lessons' => [
                    ['id' => 'day-8', 'title' => 'Day 8: Excel Is No Longer Scary', 'duration' => '20:00'],
                    ['id' => 'day-9', 'title' => 'Day 9: Presentation Tomorrow Morning', 'duration' => '15:00'],
                    ['id' => 'day-10', 'title' => 'Day 10: Your Meeting Ends in 5 Minutes', 'duration' => '15:00'],
                    ['id' => 'day-11', 'title' => 'Day 11: Write Like a CEO', 'duration' => '15:00'],
                    ['id' => 'day-12', 'title' => 'Day 12: AI Becomes Your Research Team', 'duration' => '20:00'],
                    ['id' => 'day-13', 'title' => 'Day 13: Build Your Office Copilot', 'duration' => '15:00'],
                    ['id' => 'day-14', 'title' => 'Day 14: Weekend Challenge — Finish One Office Task', 'duration' => '30:00'],
                ]
            ],
            [
                'title' => 'Level 3: AI Creator',
                'duration' => '3h 30m',
                'lessons' => [
                    ['id' => 'day-15', 'title' => 'Day 15: Become Your Own Marketing Team', 'duration' => '15:00'],
                    ['id' => 'day-16', 'title' => 'Day 16: No Designer? No Problem.', 'duration' => '20:00'],
                    ['id' => 'day-17', 'title' => 'Day 17: Shoot a Video Without a Camera', 'duration' => '20:00'],
                    ['id' => 'day-18', 'title' => 'Day 18: Sell Anything Better', 'duration' => '15:00'],
                    ['id' => 'day-19', 'title' => 'Day 19: Customers Are Waiting', 'duration' => '15:00'],
                    ['id' => 'day-20', 'title' => 'Day 20: Create One Month of Content', 'duration' => '20:00'],
                    ['id' => 'day-21', 'title' => 'Day 21: Weekend Challenge — Launch AI Campaign', 'duration' => '30:00'],
                ]
            ],
            [
                'title' => 'Level 4: AI Automator',
                'duration' => '5h 27m',
                'lessons' => [
                    ['id' => 'day-22', 'title' => 'Day 22: Stop Repeating Yourself', 'duration' => '15:00'],
                    ['id' => 'day-23', 'title' => 'Day 23: Your First Automation', 'duration' => '20:00'],
                    ['id' => 'day-24', 'title' => 'Day 24: The Strategic Multi-Turn Negotiator', 'duration' => '15:00'],
                    ['id' => 'day-25', 'title' => 'Day 25: AI for My Profession', 'duration' => '20:00'],
                    ['id' => 'day-26', 'title' => 'Day 26: Build Your AI Toolbox', 'duration' => '15:00'],
                    ['id' => 'day-27', 'title' => 'Day 27: Your AI Workday', 'duration' => '20:00'],
                    ['id' => 'day-28', 'title' => 'Day 28: Become AI-Ready & Graduation', 'duration' => '30:00'],
                ]
            ]
        ];

        foreach ($curriculum as $moduleSeq => $moduleData) {
            $module = Module::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'title' => $moduleData['title']
                ],
                [
                    'duration' => $moduleData['duration'],
                    'order_sequence' => $moduleSeq + 1,
                ]
            );

            foreach ($moduleData['lessons'] as $lessonSeq => $lessonData) {
                // Convert duration "MM:SS" into seconds
                $parts = explode(':', $lessonData['duration']);
                $durationInSeconds = (int)$parts[0] * 60 + (int)($parts[1] ?? 0);

                $lesson = Lesson::updateOrCreate(
                    [
                        'course_id' => $course->id,
                        'title' => $lessonData['title']
                    ],
                    [
                        'module_id' => $module->id,
                        'video_url' => $dummyVideo,
                        'duration_in_seconds' => $durationInSeconds,
                        'order_sequence' => $lessonSeq + 1,
                    ]
                );

                if ($lessonData['id'] === 'day-1') {
                    $ingestionService = new \App\Services\Video\TranscriptIngestionService();
                    $ingestionService->ingest($lesson->id, 
                        "[00:10] Today we discuss modern web application security.\n" .
                        "[01:15] Why do we use Sanctum here instead of Passport for SPA token auth?\n" .
                        "[02:30] Passport is a heavy OAuth2 package, while Sanctum provides cookie-based session guards.\n" .
                        "[03:45] Let us write some API routes using Sanctum auth middleware."
                    );
                }
            }
        }
    }
}
