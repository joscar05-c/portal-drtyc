<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\DocumentEntry;
use App\Models\DocumentMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentEntryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sender_type' => 'required|in:Persona Natural,Persona Jurídica',
            'document_number' => 'required|string|max:20',
            'sender_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'document_type' => 'required|string|max:50',
            'subject' => 'required|string|max:255',
            'folios' => 'required|integer|min:1',
            'main_file' => 'required|file|mimes:pdf|max:10240',
            'annexes' => 'nullable|array',
            'annexes.*' => 'file|mimes:pdf|max:10240',
        ]);

        $mainPath = $request->file('main_file')->store('document-entries/main', 'public');

        $annexesPaths = null;
        if ($request->hasFile('annexes')) {
            $annexesPaths = [];
            foreach ($request->file('annexes') as $annex) {
                $annexesPaths[] = $annex->store('document-entries/annexes', 'public');
            }
        }

        $entry = DocumentEntry::create([
            'sender_type' => $validated['sender_type'],
            'document_number' => $validated['document_number'],
            'sender_name' => $validated['sender_name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'document_type' => $validated['document_type'],
            'subject' => $validated['subject'],
            'folios' => $validated['folios'],
            'main_file_path' => $mainPath,
            'annexes_file_path' => $annexesPaths,
            'status' => 'Pendiente',
        ]);

        $mainArea = Area::where('is_main_entry_point', true)->first();

        if ($mainArea) {
            DocumentMovement::create([
                'document_entry_id' => $entry->id,
                'from_area_id' => null,
                'from_user_id' => null,
                'to_area_id' => $mainArea->id,
                'to_user_id' => null,
                'action_requested' => 'Ingreso por Mesa de Partes Virtual',
                'observations' => 'Documento ingresado vía Mesa de Partes Virtual por ' . $validated['sender_name'],
                'is_received' => false,
            ]);

            $entry->update(['status' => 'En trámite']);
        }

        return response()->json([
            'message' => 'Documento ingresado exitosamente.',
            'tracking_number' => $entry->tracking_number,
        ], 201);
    }

    public function track(Request $request): JsonResponse
    {
        $request->validate([
            'tracking_number' => 'required|string',
            'document_number' => 'required|string',
        ]);

        $entry = DocumentEntry::with([
            'movements.fromArea',
            'movements.toArea',
            'movements.fromUser',
            'movements.toUser',
        ])
            ->where('tracking_number', $request->tracking_number)
            ->where('document_number', $request->document_number)
            ->first();

        if (!$entry) {
            return response()->json([
                'message' => 'No se encontró un expediente con los datos proporcionados.',
            ], 404);
        }

        return response()->json([
            'tracking_number' => $entry->tracking_number,
            'document_type' => $entry->document_type,
            'subject' => $entry->subject,
            'sender_name' => $entry->sender_name,
            'status' => $entry->status,
            'registered_at' => $entry->created_at->format('d/m/Y H:i'),
            'movements' => $entry->movements->sortByDesc('created_at')->values()->map(fn ($m) => [
                'from_area' => $m->fromArea->name ?? 'N/A',
                'from_user' => $m->fromUser->name ?? 'N/A',
                'to_area' => $m->toArea->name ?? 'N/A',
                'to_user' => $m->toUser->name ?? null,
                'action_requested' => $m->action_requested,
                'observations' => $m->observations,
                'is_received' => $m->is_received,
                'received_at' => $m->received_at?->format('d/m/Y H:i'),
                'date' => $m->created_at->format('d/m/Y H:i'),
            ]),
        ]);
    }
}
