<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class CategoryPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Category $category): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Category $category): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Category $category): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Category $category): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
