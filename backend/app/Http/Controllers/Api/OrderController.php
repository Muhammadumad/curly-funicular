<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Admin can see all orders, students can only see their own
        if ($user->isAdmin()) {
            $orders = Order::with('user')->latest()->get();
        } else {
            $orders = Order::where('user_id', $user->id)->latest()->get();
        }

        return response()->json($orders, 200);
    }

    /**
     * Display the specified order details.
     */
    public function show(Order $order): JsonResponse
    {
        if (!Gate::allows('view', $order)) {
            return response()->json([
                'message' => 'Access denied. You do not own this order.',
            ], 403);
        }

        return response()->json($order->load('user'), 200);
    }

    /**
     * Generate PDF invoice for the specified order.
     */
    public function downloadInvoice(Order $order): Response
    {
        if (!Gate::allows('view', $order)) {
            return response()->json([
                'message' => 'Access denied. You do not own this order.',
            ], 403);
        }

        if ($order->status !== 'paid') {
            return response()->json([
                'message' => 'Invoices can only be generated for paid orders.',
            ], 400);
        }

        $pdf = Pdf::loadView('invoices.pdf', compact('order'));

        return $pdf->download("invoice-{$order->id}.pdf");
    }
}
