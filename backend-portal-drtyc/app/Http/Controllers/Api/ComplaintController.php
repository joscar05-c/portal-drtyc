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
            'tracking_id' => $complaint->id,
        ], 201);
    }
}
