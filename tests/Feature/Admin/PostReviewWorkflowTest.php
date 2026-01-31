<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Tests\Feature\Admin;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostReviewWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_requesting_approval_sets_pending_review(): void
    {
        $editor = User::factory()->create(['role' => User::ROLE_EDITOR]);
        $post = Post::create([
            'title' => ['ar' => 'مقال', 'en' => 'Post'],
            'slug' => 'post-review-test',
            'review_status' => Post::REVIEW_DRAFT,
        ]);

        $response = $this->actingAs($editor)->put(
            route('admin.posts.update', ['post' => $post->id]),
            [
                'title_ar' => 'مقال',
                'title_en' => 'Post',
                'slug' => $post->slug,
                'review_status' => Post::REVIEW_APPROVED,
                'is_published' => true,
            ]
        );

        $response->assertRedirect(route('admin.posts.index'));

        $post->refresh();
        $this->assertSame(Post::REVIEW_PENDING, $post->review_status);
        $this->assertFalse($post->is_published);
    }
}
