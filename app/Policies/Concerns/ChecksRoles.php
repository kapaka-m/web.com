<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies\Concerns;

use App\Models\User;

trait ChecksRoles
{
    protected function isAdmin(User $user): bool
    {
        return $user->isAdmin();
    }

    protected function isEditor(User $user): bool
    {
        return $user->isEditor();
    }

    protected function isAdminOrEditor(User $user): bool
    {
        return $this->isAdmin($user) || $this->isEditor($user);
    }
}
