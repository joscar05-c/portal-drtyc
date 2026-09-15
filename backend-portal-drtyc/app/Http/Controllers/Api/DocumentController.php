<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::query()
            ->with('category:id,name,slug');

        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }

        if ($request->filled('type')) {
            $query->where('document_type', $request->type);
        }

        $documents = $query
            ->orderBy('created_at', 'desc')
            ->select('id', 'title', 'document_type', 'document_number', 'year', 'file_path', 'category_id', 'created_at')
            ->paginate(15);

        return response()->json($documents);
    }
}
