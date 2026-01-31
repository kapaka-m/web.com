<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Policies;

use App\Models\Testimonial;
use App\Models\User;
use App\Policies\Concerns\ChecksRoles;

class TestimonialPolicy
{
    use ChecksRoles;

    public function viewAny(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function view(User $user, Testimonial $testimonial): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function update(User $user, Testimonial $testimonial): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function delete(User $user, Testimonial $testimonial): bool
    {
        return $this->isAdminOrEditor($user);
    }

    public function restore(User $user, Testimonial $testimonial): bool
    {
        return $this->isAdminOrEditor($user);
    }
}
