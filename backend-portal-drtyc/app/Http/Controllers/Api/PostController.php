<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::query()
            ->where('status', 'published')
            ->with('category:id,name,slug')
            ->orderBy('published_at', 'desc')
            ->select('id', 'title', 'slug', 'excerpt', 'image_path', 'category_id', 'published_at')
            ->paginate(12);

        return response()->json($posts);
    }

    public function show(string $slug)
    {
        $post = Post::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with('category:id,name,slug')
            ->select('id', 'title', 'slug', 'excerpt', 'content', 'image_path', 'category_id', 'published_at')
            ->firstOrFail();

        return response()->json($post);
    }
}
