<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\UserEnrolledInMasterclass;
use App\Models\Order;
use App\Models\User;
use App\Mail\InvoiceMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateAndSendInvoice implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(UserEnrolledInMasterclass $event): void
    {
        $session = $event->session;

        // Find the order (might not be created yet if queue runs concurrently)
        $order = Order::where('stripe_session_id', $session->id)->first();

        if (!$order) {
            // Release the job to retry in 5 seconds
            Log::info('GenerateAndSendInvoice: Order not found yet. Releasing job back to queue.', [
                'stripe_session_id' => $session->id
            ]);
            $this->release(5);
            return;
        }

        $user = $order->user;

        try {
            // Generate PDF using Laravel DomPDF
            $pdf = Pdf::loadView('pdfs.invoice', [
                'order' => $order,
                'user' => $user
            ]);

            $pdfContent = $pdf->output();
            $fileName = 'invoice_' . $order->stripe_session_id . '.pdf';
            $filePath = 'invoices/' . $fileName;

            // Save to private storage
            Storage::disk('local')->put($filePath, $pdfContent);

            // Update order path
            $order->update([
                'invoice_pdf_path' => $filePath,
            ]);

            // Send transactional email with attachment
            Mail::to($user->email)->send(new InvoiceMail($order, $filePath));

            Log::info('GenerateAndSendInvoice: Invoice generated and sent.', [
                'order_id' => $order->id,
                'email' => $user->email
            ]);
        } catch (\Throwable $e) {
            Log::error('GenerateAndSendInvoice error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
