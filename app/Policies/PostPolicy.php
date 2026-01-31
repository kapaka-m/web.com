<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class PostPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Post $post): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Post $post): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Post $post): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Post $post): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function approve(User $user, Post $post): bool
    {
        return $this->isAdmin($user);
    }

    public function publish(User $user, Post $post): bool
    {
        return $this->isAdmin($user);
    }
}
