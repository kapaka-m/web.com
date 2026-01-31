<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Service;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class ServicePolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Service $service): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Service $service): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Service $service): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Service $service): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
