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
        .details {
            background-color: #f1f5f9;
            padding: 20px;
            border-radius: 12px;
            margin: 24px 0;
        }
        .details p {
            margin: 6px 0;
            font-weight: 500;
        }
        .details strong {
            color: #0f172a;
        }
        .btn {
            display: inline-block;
            background-color: #0f172a;
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
        <h2>Payment Received</h2>
        <p>Thank you for enrolling in <strong>Build and Deploy Applied AI Systems</strong>. Your payment was processed successfully.</p>
        
        <div class="details">
            <p><strong>Order ID:</strong> #{{ $order->id }}</p>
            <p><strong>Stripe Session:</strong> {{ $order->stripe_session_id }}</p>
            <p><strong>Amount:</strong> {{ number_format($order->amount_total, 2) }} {{ $order->currency }}</p>
            <p><strong>Status:</strong> Paid</p>
        </div>

        <p>We have generated your formal tax invoice. It has been attached to this email as a PDF for your records.</p>

        <a href="{{ config('services.spa.url', 'http://192.168.100.3:5173') }}/dashboard" class="btn">Go to Dashboard</a>
    </div>
</body>
</html>
