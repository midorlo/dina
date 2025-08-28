import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useBreadcrumbs() {
  const route = useRoute();
  const router = useRouter();

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
      const slugParam = paramMatches.at(-1);

      const params = route.params as Record<string, unknown>;

      let title: string =
        (typeof (record.meta as any)?.breadcrumb === 'function'
          ? (record.meta as any).breadcrumb(route)
          : ((record.meta as any)?.breadcrumb as string | undefined)) ??
        (slugParam && typeof params[slugParam] === 'string' ? (params[slugParam] as string) : segment);

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

    return items;
  });

  return { breadcrumbItems };
}
