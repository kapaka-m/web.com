<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\SiteSetting;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class SiteSettingPolicy
{
    use ChecksRoles;

    public function view(User $user, SiteSetting $settings): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, SiteSetting $settings): bool
    {
        return $this->isAdmin($user);
    }
}
