<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            padding: 24px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        h2 {
            font-weight: 800;
            font-size: 24px;
            color: #0f172a;
            margin-top: 0;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
        }
        .btn {
            display: inline-block;
            background-color: #6366f1;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 12px;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to the Masterclass, {{ $user->name }}!</h2>
        <p>You have successfully unlocked <strong>Build and Deploy Applied AI Systems</strong>.</p>
        
        <p>This course is designed to guide you step-by-step through building production-ready AI systems using modern architectures, multi-agent frameworks, and real-time telemetry.</p>
        
        <p>Your classroom is fully unlocked. You can access it immediately from your dashboard.</p>

        <a href="{{ config('services.spa.url', 'http://192.168.100.3:5173') }}/classroom" class="btn">Enter Classroom</a>
    </div>
</body>
</html>
