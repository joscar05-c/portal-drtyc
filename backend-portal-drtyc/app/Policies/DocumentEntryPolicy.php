<?php

namespace App\Policies;

use App\Models\DocumentEntry;
use App\Models\User;

class DocumentEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'editor', 'mesa_de_partes', 'especialista']);
    }

    public function view(User $user, DocumentEntry $documentEntry): bool
    {
        if ($user->hasAnyRole(['super_admin', 'admin', 'editor'])) {
            return true;
        }

        if ($user->hasRole('mesa_de_partes')) {
            return true;
        }

        if ($user->hasRole('especialista')) {
            return $documentEntry->movements->contains(function ($movement) use ($user) {
                return $movement->to_area_id === $user->area_id && !$movement->is_received;
            });
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'mesa_de_partes']);
    }

    public function update(User $user, DocumentEntry $documentEntry): bool
    {
        if ($user->hasAnyRole(['super_admin', 'admin'])) {
            return true;
        }

        if ($user->hasRole('mesa_de_partes')) {
            return true;
        }

        if ($user->hasRole('especialista')) {
            return $documentEntry->movements->contains(function ($movement) use ($user) {
                return $movement->to_area_id === $user->area_id && !$movement->is_received;
            });
        }

        return false;
    }

    public function delete(User $user, DocumentEntry $documentEntry): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function restore(User $user, DocumentEntry $documentEntry): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']);
    }

    public function forceDelete(User $user, DocumentEntry $documentEntry): bool
    {
        return $user->hasRole('super_admin');
    }
}
