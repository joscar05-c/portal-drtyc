<?php

namespace App\Mail;

use App\Models\DocumentEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExpedientSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DocumentEntry $expedient,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Comprobante de Ingreso - Mesa de Partes Virtual',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.expedient_submitted',
        );
    }
}
