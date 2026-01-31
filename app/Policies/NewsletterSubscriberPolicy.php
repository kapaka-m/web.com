<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class NewsletterSubscriberPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $this->isAdmin($user);
    }
}
