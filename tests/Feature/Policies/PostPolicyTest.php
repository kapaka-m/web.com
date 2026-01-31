<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Tests\Feature\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class PostPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_posts(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $post = Post::create([
            'title' => ['ar' => 'مقال', 'en' => 'Post'],
            'slug' => 'policy-post-approve',
        ]);

        $this->assertTrue(Gate::forUser($admin)->allows('approve', $post));
        $this->assertTrue(Gate::forUser($admin)->allows('publish', $post));
    }

    public function test_editor_cannot_approve_posts(): void
    {
        $editor = User::factory()->create(['role' => User::ROLE_EDITOR]);
        $post = Post::create([
            'title' => ['ar' => 'مقال', 'en' => 'Post'],
            'slug' => 'policy-post-editor',
        ]);

        $this->assertFalse(Gate::forUser($editor)->allows('approve', $post));
        $this->assertFalse(Gate::forUser($editor)->allows('publish', $post));
    }
}
