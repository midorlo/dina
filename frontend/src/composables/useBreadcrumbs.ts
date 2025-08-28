import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchBlog, fetchBlogPost } from '@/services/blogs';
import { fetchProfile } from '@/services/profiles';

export function useBreadcrumbs() {
  const route = useRoute();
  const router = useRouter();
  const nameCache = ref<Record<string, string>>({});
  const inflight = new Set<string>();

  function resolveProfileName(id: string): string {
    const key = `profile:${id}`;
    const cached = nameCache.value[key];
    if (cached) return cached;
    if (!inflight.has(key)) {
      inflight.add(key);
      fetchProfile(id)
        .then(p => {
          nameCache.value = { ...nameCache.value, [key]: p?.username || id };
        })
        .finally(() => inflight.delete(key));
    }
    return id;
  }

  function resolveBlogName(id: string): string {
    const key = `blog:${id}`;
    const cached = nameCache.value[key];
    if (cached) return cached;
    if (!inflight.has(key)) {
      inflight.add(key);
      fetchBlog(id)
        .then(b => {
          nameCache.value = { ...nameCache.value, [key]: b?.name || id };
        })
        .finally(() => inflight.delete(key));
    }
    return id;
  }

  function resolvePostTitle(blogId: string, postId: string): string {
    const key = `post:${blogId}:${postId}`;
    const cached = nameCache.value[key];
    if (cached) return cached;
    if (!inflight.has(key)) {
      inflight.add(key);
      fetchBlogPost(blogId, postId)
        .then(p => {
          nameCache.value = { ...nameCache.value, [key]: p?.title || postId };
        })
        .finally(() => inflight.delete(key));
    }
    return postId;
  }

  const breadcrumbItems = computed(() => {
    if (route.matched.length <= 1) return [];

    const items: Array<{ title: string; disabled: boolean; to?: string }> = [
      { title: 'Dina', disabled: false, to: '/' }
    ];

    const records = route.matched.slice(1);

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const parts = record.path.split('/').filter(Boolean);
      const segment = (parts.at(-1) ?? '').trim();

      const paramMatches = [...segment.matchAll(/:([^/-]+)/g)].map(m => m[1]);
      // Prefer last meaningful param (skip optional slug params)
      const slugParam = paramMatches.toReversed().find(p => !/slug$/i.test(p));

      const params = route.params as Record<string, string>;

      const titleMeta =
        typeof (record.meta as any)?.breadcrumb === 'function'
          ? (record.meta as any).breadcrumb(route)
          : ((record.meta as any)?.breadcrumb as string | undefined);

      let fallbackTitle = segment;
      if (slugParam && typeof params[slugParam] === 'string') {
        if (record.path.includes('/profiles') && slugParam === 'id') {
          fallbackTitle = resolveProfileName(params[slugParam]);
        } else if (record.path.includes('/blogs') && slugParam === 'id') {
          fallbackTitle = resolveBlogName(params[slugParam]);
        } else if (record.path.includes('/blogs') && slugParam?.toLowerCase() === 'postid') {
          fallbackTitle = resolvePostTitle(params.id, params[slugParam]);
        } else {
          fallbackTitle = params[slugParam];
        }
      }

      let title: string = titleMeta ?? fallbackTitle;

      title = title
        .replace(/[:()*]/g, '')
        .replace(/-/g, ' ')
        .replace(/^\w/u, c => c.toUpperCase());

      const to = router.resolve({ name: record.name as any, params } as any).path;

      items.push({
        title,
        disabled: index === records.length - 1,
        to
      });
    }

    // Remove consecutive duplicates (e.g., "Profiles / Profiles")
    const dedupConsecutive = items.filter((item, idx, arr) => idx === 0 || item.title !== arr[idx - 1].title);
    // Remove global duplicates by title (e.g., ":id / :id / :id")
    const seen = new Set<string>();
    const dedupGlobal: typeof dedupConsecutive = [];
    for (const it of dedupConsecutive) {
      if (!seen.has(it.title)) {
        dedupGlobal.push(it);
        seen.add(it.title);
      }
    }
    return dedupGlobal;
  });

  return { breadcrumbItems };
}
