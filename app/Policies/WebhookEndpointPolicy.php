<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\User;
use App\Models\WebhookEndpoint;
use App\Policies\Concerns\ChecksRoles;

class WebhookEndpointPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, WebhookEndpoint $endpoint): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, WebhookEndpoint $endpoint): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, WebhookEndpoint $endpoint): bool
    {
        return $this->isAdmin($user);
    }
}
