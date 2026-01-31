<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        if (!config('security.enabled', true)) {
            return $response;
        }

        $headers = config('security.headers', []);
        if (!empty($headers['x_content_type_options'])) {
            $response->headers->set('X-Content-Type-Options', $headers['x_content_type_options']);
        }
        if (!empty($headers['x_frame_options'])) {
            $response->headers->set('X-Frame-Options', $headers['x_frame_options']);
        }
        if (!empty($headers['referrer_policy'])) {
            $response->headers->set('Referrer-Policy', $headers['referrer_policy']);
        }
        if (!empty($headers['permissions_policy'])) {
            $response->headers->set('Permissions-Policy', $headers['permissions_policy']);
        }
        if (!empty($headers['cross_origin_opener_policy'])) {
            $response->headers->set('Cross-Origin-Opener-Policy', $headers['cross_origin_opener_policy']);
        }
        if (!empty($headers['cross_origin_resource_policy'])) {
            $response->headers->set('Cross-Origin-Resource-Policy', $headers['cross_origin_resource_policy']);
        }

        $hsts = config('security.hsts', []);
        if (!empty($hsts['enabled']) && $request->isSecure()) {
            $value = 'max-age=' . (int) ($hsts['max_age'] ?? 31536000);
            if (!empty($hsts['include_subdomains'])) {
                $value .= '; includeSubDomains';
            }
            if (!empty($hsts['preload'])) {
                $value .= '; preload';
            }
            $response->headers->set('Strict-Transport-Security', $value);
        }

        $csp = config('security.csp', []);
        if (!empty($csp['enabled'])) {
            $directives = $csp['directives'] ?? [];
            $headerValue = $this->buildCsp($directives);
            if ($headerValue !== '') {
                $headerName = !empty($csp['report_only'])
                    ? 'Content-Security-Policy-Report-Only'
                    : 'Content-Security-Policy';
                $response->headers->set($headerName, $headerValue);
            }
        }

        return $response;
    }

    private function buildCsp(array $directives): string
    {
        $parts = [];

        foreach ($directives as $name => $values) {
            if (!$values || !is_array($values)) {
                continue;
            }

            $parts[] = $name . ' ' . implode(' ', array_unique($values));
        }

        return implode('; ', $parts);
    }
}
