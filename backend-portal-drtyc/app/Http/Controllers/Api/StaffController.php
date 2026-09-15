<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;

class StaffController extends Controller
{
    public function index()
    {
        $staff = StaffMember::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'full_name', 'position', 'email', 'phone', 'photo_path']);

        return response()->json($staff);
    }
}
