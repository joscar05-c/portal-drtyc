<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($projects);
    }
}
