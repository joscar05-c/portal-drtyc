<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobCall;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostulateController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'job_call_id' => 'required|exists:job_calls,id',
            'document_number' => 'required|string|max:20',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $jobCall = JobCall::find($validated['job_call_id']);

        if ($jobCall->status !== 'Vigente') {
            return response()->json([
                'message' => 'La convocatoria no acepta postulaciones en este momento.',
            ], 403);
        }

        if ($jobCall->application_start_at && $jobCall->application_end_at) {
            $now = Carbon::now();
            $start = Carbon::parse($jobCall->application_start_at);
            $end = Carbon::parse($jobCall->application_end_at);

            if ($now->lt($start)) {
                return response()->json([
                    'message' => 'Las postulaciones aún no están abiertas. Fecha de inicio: ' . $start->format('d/m/Y H:i'),
                ], 403);
            }

            if ($now->gt($end)) {
                return response()->json([
                    'message' => 'El plazo de postulación ha finalizado. Fecha límite: ' . $end->format('d/m/Y H:i'),
                ], 403);
            }
        } else {
            $now = Carbon::now();
            $start = Carbon::parse($jobCall->start_date)->startOfDay();
            $end = Carbon::parse($jobCall->end_date)->endOfDay();

            if ($now->lt($start) || $now->gt($end)) {
                return response()->json([
                    'message' => 'La convocatoria no está vigente. El período de postulación ha finalizado o aún no ha comenzado.',
                ], 403);
            }
        }

        $existingApplication = JobApplication::where('job_call_id', $validated['job_call_id'])
            ->where('document_number', $validated['document_number'])
            ->exists();

        if ($existingApplication) {
            return response()->json([
                'message' => 'Ya existe una postulación registrada con este número de documento para esta convocatoria.',
            ], 409);
        }

        $file = $request->file('file');
        $fileName = 'cv_' . $validated['document_number'] . '_' . time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('job-applications', $fileName, 'public');

        $application = JobApplication::create([
            'job_call_id' => $validated['job_call_id'],
            'document_number' => $validated['document_number'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'file_path' => $filePath,
            'status' => 'Recibido',
        ]);

        return response()->json([
            'message' => 'Postulación registrada exitosamente.',
            'application_id' => $application->id,
        ], 201);
    }

    public function checkStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'job_call_id' => 'required|exists:job_calls,id',
            'document_number' => 'required|string|max:20',
        ]);

        $application = JobApplication::where('job_call_id', $validated['job_call_id'])
            ->where('document_number', $validated['document_number'])
            ->first();

        if (!$application) {
            return response()->json([
                'found' => false,
                'message' => 'No se encontró ninguna postulación con los datos proporcionados.',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'status' => $application->status,
            'updated_at' => $application->updated_at->format('d/m/Y H:i'),
        ]);
    }
}
