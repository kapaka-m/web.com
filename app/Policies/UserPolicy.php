<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class UserPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, User $model): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, User $model): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, User $model): bool
    {
        return $this->isAdmin($user);
    }
}
