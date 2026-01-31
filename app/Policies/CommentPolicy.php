<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class CommentPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Comment $comment): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Comment $comment): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Comment $comment): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Comment $comment): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
