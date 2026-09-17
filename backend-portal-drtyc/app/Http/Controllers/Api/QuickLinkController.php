<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuickLink;

class QuickLinkController extends Controller
{
    public function index()
    {
        $links = QuickLink::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get([
                'id',
                'title',
                'description',
                'url',
                'icon',
                'badge_text',
                'badge_color',
                'footer_info',
                'button_text',
                'button_icon',
            ]);

        return response()->json($links);
    }
}
