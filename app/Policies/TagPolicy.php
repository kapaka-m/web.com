<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Tag;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class TagPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Tag $tag): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Tag $tag): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Tag $tag): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Tag $tag): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
