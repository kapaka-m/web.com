<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class TranslationController extends Controller
{
    public function translate(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'editor'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'text' => ['required', 'string'],
            'source' => ['required', 'string', 'in:ar,en'],
            'target' => ['required', 'string', 'in:ar,en'],
        ]);

        if (!config('translation.enabled')) {
            throw ValidationException::withMessages([
                'text' => __('Translation provider is not configured.'),
            ]);
        }

        if ($validated['source'] === $validated['target']) {
            return response()->json([
                'translation' => $validated['text'],
            ]);
        }

        $provider = config('translation.provider');
        if ($provider !== 'libre') {
            throw ValidationException::withMessages([
                'text' => __('Translation provider is not supported.'),
            ]);
        }

        $endpoint = config('translation.endpoint');
        if (!$endpoint) {
            throw ValidationException::withMessages([
                'text' => __('Translation endpoint is missing.'),
            ]);
        }

        /** @var Response $response */
        $response = Http::timeout(config('translation.timeout', 8))
            ->asJson()
            ->post($endpoint, [
                'q' => $validated['text'],
                'source' => $validated['source'],
                'target' => $validated['target'],
                'format' => 'text',
                'api_key' => config('translation.api_key'),
            ]);

        if (!$response->ok()) {
            throw ValidationException::withMessages([
                'text' => __('Translation failed.'),
            ]);
        }

        $translation = data_get($response->json(), 'translatedText');
        if (!is_string($translation) || $translation === '') {
            throw ValidationException::withMessages([
                'text' => __('Translation failed.'),
            ]);
        }

        return response()->json([
            'translation' => $translation,
        ]);
    }
}
