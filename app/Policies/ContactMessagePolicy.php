<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\ContactMessage;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class ContactMessagePolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, ContactMessage $message): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, ContactMessage $message): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
