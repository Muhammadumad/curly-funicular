<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            line-height: 1.4;
            padding: 30px;
            font-size: 13px;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
        }
        table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }
        table td {
            padding: 8px;
            vertical-align: top;
        }
        table tr td:nth-child(2) {
            text-align: right;
        }
        .title {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 5px;
        }
        .header-table {
            margin-bottom: 40px;
        }
        .header-table td {
            padding: 0;
        }
        .details-table {
            margin-bottom: 40px;
        }
        .details-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            text-align: left;
            padding: 10px 8px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
        }
        .details-table th:nth-child(2) {
            text-align: right;
        }
        .details-table td {
            border-bottom: 1px solid #f1f5f9;
            padding: 12px 8px;
        }
        .details-table tr.total td {
            font-weight: 700;
            border-top: 2px solid #e2e8f0;
            border-bottom: none;
            font-size: 14px;
            color: #0f172a;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header-table">
            <tr>
                <td>
                    <div class="title">INVOICE</div>
                    <span style="color: #64748b;">Invoice #: {{ $order->id }}</span><br>
                    <span style="color: #64748b;">Date: {{ $order->created_at->format('F d, Y') }}</span>
                </td>
                <td style="text-align: right;">
                    <strong>Crux LMS Inc.</strong><br>
                    100 Innovation Way<br>
                    San Francisco, CA 94105<br>
                    support@crux.io
                </td>
            </tr>
        </table>

        <table class="header-table" style="margin-bottom: 30px;">
            <tr>
                <td>
                    <strong style="color: #475569; text-transform: uppercase; font-size: 10px;">Billed To:</strong><br>
                    <strong>{{ $user->name }}</strong><br>
                    {{ $user->email }}
                </td>
                <td style="text-align: right;">
                    <strong style="color: #475569; text-transform: uppercase; font-size: 10px;">Payment Details:</strong><br>
                    Stripe Checkout<br>
                    Transaction: {{ substr($order->stripe_session_id, 0, 18) }}...
                </td>
            </tr>
        </table>

        <table class="details-table">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Build & Deploy Applied AI Systems</strong><br>
                        <span style="font-size: 11px; color: #64748b;">Full Lifetime Course Enrollment & Telemetry License</span>
                    </td>
                    <td>{{ number_format($order->amount_total, 2) }} {{ $order->currency }}</td>
                </tr>
                <tr class="total">
                    <td>Total Paid</td>
                    <td>{{ number_format($order->amount_total, 2) }} {{ $order->currency }}</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            Thank you for your purchase! Your workspace has been activated. Please log in to continue learning.<br>
            <span style="font-size: 10px; margin-top: 5px; display: block;">Crux AI LMS Platform &copy; {{ date('Y') }}</span>
        </div>
    </div>
</body>
</html>
