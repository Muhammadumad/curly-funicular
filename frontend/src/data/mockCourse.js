// src/data/mockCourse.js

// Standard dummy video URL for testing video players
const DUMMY_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const courseData = {
  id: "28-day-ai-challenge",
  title: "AI Growth Academy — 28-Day AI Challenge",
  subtitle: "From AI Beginner to AI-Powered Professional",
  description: "Master AI in 28 days through scenario-driven, mission-based challenges. Progress from survival-level basics to full automation workflows.",
  totalDuration: "14h 32m",
  totalLessons: 29,
  modules: [
    // --- MODULE 1: AI SURVIVAL ---
    {
      id: "mod-survival",
      title: "Level 1: AI Survival",
      duration: "2h 35m",
      lessons: [
        {
          id: "day-0",
          title: "Day 0: Onboarding Quiz",
          duration: "2:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: true,
          type: "video"
        },
        {
          id: "day-1",
          title: "Day 1: Your AI Assistant",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: true,
          type: "video"
        },
        {
          id: "day-2",
          title: "Day 2: Inbox Zero",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-3",
          title: "Day 3: The Report Due Today",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-4",
          title: "Day 4: Understand This 100-Page PDF",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-5",
          title: "Day 5: Prompt Engineering",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-6",
          title: "Day 6: Organize My Life",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-7",
          title: "Day 7: Weekend Challenge — Replace One Hour",
          duration: "30:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        }
      ]
    },

    // --- MODULE 2: AI PROFESSIONAL ---
    {
      id: "mod-professional",
      title: "Level 2: AI Professional",
      duration: "3h 00m",
      lessons: [
        {
          id: "day-8",
          title: "Day 8: Excel Is No Longer Scary",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-9",
          title: "Day 9: Presentation Tomorrow Morning",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-10",
          title: "Day 10: Your Meeting Ends in 5 Minutes",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-11",
          title: "Day 11: Write Like a CEO",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-12",
          title: "Day 12: AI Becomes Your Research Team",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-13",
          title: "Day 13: Build Your Office Copilot",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-14",
          title: "Day 14: Weekend Challenge — Finish One Office Task",
          duration: "30:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        }
      ]
    },

    // --- MODULE 3: AI CREATOR ---
    {
      id: "mod-creator",
      title: "Level 3: AI Creator",
      duration: "3h 30m",
      lessons: [
        {
          id: "day-15",
          title: "Day 15: Become Your Own Marketing Team",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-16",
          title: "Day 16: No Designer? No Problem.",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-17",
          title: "Day 17: Shoot a Video Without a Camera",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-18",
          title: "Day 18: Sell Anything Better",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-19",
          title: "Day 19: Customers Are Waiting",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-20",
          title: "Day 20: Create One Month of Content",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-21",
          title: "Day 21: Weekend Challenge — Launch AI Campaign",
          duration: "30:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        }
      ]
    },

    // --- MODULE 4: AI AUTOMATOR ---
    {
      id: "mod-automator",
      title: "Level 4: AI Automator",
      duration: "5h 27m",
      lessons: [
        {
          id: "day-22",
          title: "Day 22: Stop Repeating Yourself",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-23",
          title: "Day 23: Your First Automation",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-24",
          title: "Day 24: The Strategic Multi-Turn Negotiator",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-25",
          title: "Day 25: AI for My Profession",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-26",
          title: "Day 26: Build Your AI Toolbox",
          duration: "15:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-27",
          title: "Day 27: Your AI Workday",
          duration: "20:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        },
        {
          id: "day-28",
          title: "Day 28: Become AI-Ready & Graduation",
          duration: "30:00",
          videoUrl: DUMMY_VIDEO,
          isCompleted: false,
          type: "video"
        }
      ]
    }
  ]
};