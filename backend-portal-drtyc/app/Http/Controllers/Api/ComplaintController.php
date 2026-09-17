<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'document_number' => 'required|string|max:20',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'type' => 'required|in:queja,reclamo',
            'details' => 'required|string|max:2000',
        ]);

        $validated['status'] = 'pendiente';

        $complaint = Complaint::create($validated);

        return response()->json([
            'message' => 'Reclamo registrado exitosamente.',
            'tracking_code' => $complaint->tracking_code,
        ], 201);
    }

    public function track(Request $request): JsonResponse
    {
        $request->validate([
            'tracking_code' => 'required|string',
            'document_number' => 'required|string',
        ]);

        $complaint = Complaint::where('tracking_code', $request->tracking_code)
            ->where('document_number', $request->document_number)
            ->first();

        if (!$complaint) {
            return response()->json([
                'message' => 'No se encontró un reclamo con los datos proporcionados.',
            ], 404);
        }

        return response()->json([
            'tracking_code' => $complaint->tracking_code,
            'status' => $complaint->status,
            'status_label' => match ($complaint->status) {
                'pendiente' => 'Pendiente',
                'en_proceso' => 'En Proceso',
                'atendido' => 'Atendido',
                default => $complaint->status,
            },
            'type' => $complaint->type,
            'type_label' => $complaint->type === 'queja' ? 'Queja' : 'Reclamo',
            'registered_at' => $complaint->created_at->format('d/m/Y H:i'),
            'details' => $complaint->details,
            'citizen_response' => $complaint->reply,
        ]);
    }
}
