<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Partner;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class PartnerPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Partner $partner): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Partner $partner): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Partner $partner): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Partner $partner): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
