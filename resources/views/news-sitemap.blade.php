{{-- MOHAMED HASSANIN (KAPAKA) --}}
@php echo '<' . '?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    @foreach ($posts as $post)
        <url>
            <loc>{{ route('blog.show', ['locale' => $locale, 'post' => $post['slug']]) }}</loc>
            <news:news>
                <news:publication>
                    <news:name>{{ $site['site_name'] }}</news:name>
                    <news:language>{{ $locale }}</news:language>
                </news:publication>
                <news:publication_date>{{ $post['published_at'] }}</news:publication_date>
                <news:title>{{ $post['title'] }}</news:title>
            </news:news>
        </url>
    @endforeach
</urlset>
