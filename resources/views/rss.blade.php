{{-- MOHAMED HASSANIN (KAPAKA) --}}
@php echo '<' . '?xml version="1.0" encoding="UTF-8"?>'; @endphp
<rss version="2.0">
    <channel>
        <title>{{ $site['site_name'] }}</title>
        <link>{{ route('home', ['locale' => $locale]) }}</link>
        <description>{{ $site['tagline'] }}</description>
        <language>{{ $locale }}</language>
        <lastBuildDate>{{ now()->toRfc2822String() }}</lastBuildDate>
        @foreach ($posts as $post)
            <item>
                <title><![CDATA[{{ $post['title'] }}]]></title>
                <link>{{ route('blog.show', ['locale' => $locale, 'post' => $post['slug']]) }}</link>
                <guid>{{ route('blog.show', ['locale' => $locale, 'post' => $post['slug']]) }}</guid>
                @if (! empty($post['published_at']))
                    <pubDate>{{ $post['published_at'] }}</pubDate>
                @endif
                @if (! empty($post['excerpt']))
                    <description><![CDATA[{{ $post['excerpt'] }}]]></description>
                @endif
            </item>
        @endforeach
    </channel>
</rss>
