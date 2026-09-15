<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'editor']);
    }

    public function view(User $user, Post $post): bool
    {
        return $user->hasAnyRole(['admin', 'editor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'editor']);
    }

    public function update(User $user, Post $post): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasRole('editor') && $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasRole('editor') && $user->id === $post->user_id;
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->hasRole('admin');
    }
}
