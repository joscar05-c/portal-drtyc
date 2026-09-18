<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobCall;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobCallController extends Controller
{
    public function index(): JsonResponse
    {
        $jobCalls = JobCall::orderBy('created_at', 'desc')->get();

        return response()->json($jobCalls);
    }

    public function show(string $id): JsonResponse
    {
        $jobCall = JobCall::find($id);

        if (!$jobCall) {
            return response()->json([
                'message' => 'Convocatoria no encontrada.',
            ], 404);
        }

        return response()->json($jobCall);
    }

    public function byType(Request $request, string $type): JsonResponse
    {
        $jobCalls = JobCall::where('type', $type)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($jobCalls);
    }
}
