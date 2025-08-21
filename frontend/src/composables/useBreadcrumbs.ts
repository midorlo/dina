import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useBreadcrumbs() {
  const route = useRoute()
  const router = useRouter()

  const breadcrumbItems = computed(() => {
    if (route.matched.length <= 1) return []

    const items: Array<{ title: string; disabled: boolean; to?: string }> = [
      { title: 'Dina', disabled: false, to: '/' },
    ]

    const records = route.matched.slice(1)

    for (let index = 0; index < records.length; index++) {
      const record = records[index]
      const segment = (record.path.split('/').findLast(Boolean) ?? '').trim()

      const paramMatches = [...segment.matchAll(/:([^/-]+)/g)].map((m) => m[1])
      const slugParam = paramMatches.at(-1)

      let title: string =
        (typeof record.meta?.breadcrumb === 'function'
          ? record.meta.breadcrumb(route)
          : (record.meta?.breadcrumb as string | undefined)) ??
        (slugParam && typeof route.params[slugParam] === 'string'
          ? (route.params[slugParam] as string)
          : segment)

      title = title
        .replace(/[:()*]/g, '')
        .replace(/-/g, ' ')
        .replace(/^\w/u, (c) => c.toUpperCase())

      const to = router.resolve({ name: record.name as string, params: route.params }).path

      items.push({
        title,
        disabled: index === records.length - 1,
        to,
      })
    }

    return items
  })

  return { breadcrumbItems }
}
