<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class ProjectPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Project $project): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Project $project): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Project $project): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Project $project): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
