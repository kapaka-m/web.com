<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use Aws\SecretsManager\SecretsManagerClient;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class Secrets
{
    public static function resolve(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return '';
        }

        if (!str_contains($value, ':')) {
            return $value;
        }

        if (str_starts_with($value, 'env:')) {
            return env(substr($value, 4));
        }

        if (str_starts_with($value, 'vault:')) {
            return self::resolveVault(substr($value, 6));
        }

        if (str_starts_with($value, 'aws:')) {
            return self::resolveAws(substr($value, 4));
        }

        if (str_starts_with($value, 'secret:')) {
            $key = substr($value, 7);
            return self::resolveByDriver($key);
        }

        return $value;
    }

    private static function resolveByDriver(string $key): ?string
    {
        $driver = config('secrets.driver', 'env');

        return match ($driver) {
            'vault' => self::resolveVault($key),
            'aws' => self::resolveAws($key),
            default => env($key),
        };
    }

    private static function resolveVault(string $reference): ?string
    {
        $address = rtrim((string) config('secrets.vault.address'), '/');
        $token = config('secrets.vault.token');
        $mount = config('secrets.vault.mount', 'secret');
        $version = config('secrets.vault.version', 'v2');

        if ($address === '' || !$token) {
            return null;
        }

        [$path, $field] = array_pad(explode('#', $reference, 2), 2, null);
        $path = ltrim($path, '/');

        $cacheKey = 'secrets.vault.' . md5($path . '|' . $field);

        return Cache::remember($cacheKey, config('secrets.cache_ttl', 300), function () use ($address, $token, $mount, $version, $path, $field) {
            $endpoint = $version === 'v2'
                ? "{$address}/v1/{$mount}/data/{$path}"
                : "{$address}/v1/{$mount}/{$path}";

            /** @var Response $response */
            $response = Http::withHeaders(['X-Vault-Token' => $token])
                ->timeout(10)
                ->get($endpoint);

            if (!$response->ok()) {
                return null;
            }

            $data = $response->json();
            $payload = $version === 'v2'
                ? Arr::get($data, 'data.data', [])
                : Arr::get($data, 'data', []);

            if (!$field) {
                return is_string($payload) ? $payload : json_encode($payload);
            }

            $value = Arr::get($payload, $field);
            return is_string($value) ? $value : (is_scalar($value) ? (string) $value : null);
        });
    }

    private static function resolveAws(string $reference): ?string
    {
        $secretId = $reference;
        $field = null;

        if (str_contains($reference, '#')) {
            [$secretId, $field] = explode('#', $reference, 2);
        }

        if (!class_exists(SecretsManagerClient::class)) {
            return null;
        }

        $region = config('secrets.aws.region');
        if (!$region) {
            return null;
        }

        $cacheKey = 'secrets.aws.' . md5($secretId . '|' . $field);

        return Cache::remember($cacheKey, config('secrets.cache_ttl', 300), function () use ($region, $secretId, $field) {
            $client = new SecretsManagerClient([
                'version' => 'latest',
                'region' => $region,
            ]);

            $result = $client->getSecretValue(['SecretId' => $secretId]);
            $secretString = $result['SecretString'] ?? null;

            if (!$secretString) {
                return null;
            }

            if (!$field) {
                return $secretString;
            }

            $decoded = json_decode($secretString, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return null;
            }

            $value = Arr::get($decoded, $field);

            return is_string($value) ? $value : (is_scalar($value) ? (string) $value : null);
        });
    }
}
