<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eeeeee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            padding: 30px;
            background: #ffffff;
        }
        .header-table {
            width: 100%;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #4f46e5;
            letter-spacing: -1px;
        }
        .invoice-title {
            text-align: right;
            font-size: 24px;
            color: #1e293b;
            font-weight: bold;
        }
        .details-table {
            width: 100%;
            margin-bottom: 40px;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 8px 0;
            vertical-align: top;
        }
        .bold {
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .items-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            color: #475569;
            font-weight: bold;
            text-align: left;
            padding: 12px;
        }
        .items-table td {
            border-bottom: 1px solid #e2e8f0;
            padding: 12px;
        }
        .total-box {
            float: right;
            width: 250px;
            margin-top: 20px;
        }
        .total-table {
            width: 100%;
            border-collapse: collapse;
        }
        .total-table td {
            padding: 8px 12px;
        }
        .total-row {
            background-color: #f8fafc;
            font-weight: bold;
            font-size: 16px;
            color: #4f46e5;
            border-top: 2px solid #4f46e5;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            clear: both;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header-table">
            <tr>
                <td>
                    <span class="logo">AETHER</span>
                </td>
                <td class="invoice-title">
                    INVOICE
                </td>
            </tr>
        </table>

        <table class="details-table">
            <tr>
                <td style="width: 50%;">
                    <span class="bold">Billed To:</span><br>
                    {{ $order->user->name }}<br>
                    {{ $order->user->email }}
                </td>
                <td style="width: 50%;" class="text-right">
                    <span class="bold">Invoice Reference:</span> #{{ $order->id }}<br>
                    <span class="bold">Date:</span> {{ $order->created_at->format('F d, Y') }}<br>
                    <span class="bold">Payment Method:</span> {{ ucfirst($order->gateway) }} Billing<br>
                    <span class="bold">Transaction ID:</span> {{ $order->gateway_transaction_id }}<br>
                    <span class="bold">Status:</span> <span style="color: #10b981; font-weight: bold;">{{ strtoupper($order->status) }}</span>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right" style="width: 100px;">Qty</th>
                    <th class="text-right" style="width: 150px;">Unit Price</th>
                    <th class="text-right" style="width: 150px;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <span class="bold">Build and Deploy Applied AI Systems</span><br>
                        <span style="font-size: 11px; color: #64748b;">Flagship masterclass — 28-Day AI Challenge</span>
                    </td>
                    <td class="text-right">1</td>
                    <td class="text-right">${{ number_format((float) $order->amount, 2) }}</td>
                    <td class="text-right">${{ number_format((float) $order->amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-box">
            <table class="total-table">
                <tr>
                    <td>Subtotal:</td>
                    <td class="text-right">${{ number_format((float) $order->amount, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td class="text-right">$0.00</td>
                </tr>
                <tr class="total-row">
                    <td>Total Paid:</td>
                    <td class="text-right">${{ number_format((float) $order->amount, 2) }} {{ $order->currency }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for your purchase! You have lifetime access to the masterclass.</p>
            <p>Aether Masterclass Series — Merchant of Record: Paddle Billing (VAT/Sales-tax handled dynamically).</p>
        </div>
    </div>
</body>
</html>
