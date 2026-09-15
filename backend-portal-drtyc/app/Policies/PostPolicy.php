<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_any_post');
    }

    public function view(User $user, Post $post): bool
    {
        return $user->hasPermissionTo('view_post');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_post');
    }

    public function update(User $user, Post $post): bool
    {
        return $user->hasPermissionTo('update_post');
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->hasPermissionTo('delete_post');
    }

    public function restore(User $user, Post $post): bool
    {
        return false;
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return false;
    }
}
