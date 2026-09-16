<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;

class JobPostingController extends Controller
{
    public function index()
    {
        $jobPostings = JobPosting::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($jobPostings);
    }
}
