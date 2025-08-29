import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBlog, useBlogPost } from '@/services/blogs';
import { useProfile } from '@/services/profiles';

export function useBreadcrumbs() {
  const route = useRoute();
  const nameCache = ref<Record<string, string>>({});

  // --- Reactive Data Fetching with Vue Query ---

  const profileId = computed<string | undefined>(() => {
    if (
      (route.path.includes('/profiles/') || route.path.includes('/photos/')) &&
      typeof (route.params as any).id === 'string'
    ) {
      return (route.params as any).id as string;
    }
    return undefined;
  });

  const blogId = computed<string | undefined>(() => {
    if (route.path.includes('/blogs/') && typeof (route.params as any).id === 'string') {
      return (route.params as any).id as string;
    }
    return undefined;
  });

  const postId = computed<string | undefined>(() => {
    if (typeof blogId.value === 'string' && typeof (route.params as any).postId === 'string') {
      return (route.params as any).postId as string;
    }
    return undefined;
  });

  const { data: profileData } = useProfile(profileId.value || '');
  const { data: blogData } = useBlog(blogId.value || '');
  const { data: postData } = useBlogPost(blogId.value || '', postId.value || '');

  // --- Caching Logic ---

  watch(profileData, profile => {
    if (profile?.userId) {
      nameCache.value[`profile:${profile.userId}`] = profile.username;
    }
  });

  watch(blogData, blog => {
    if (blog?.id) {
      nameCache.value[`blog:${blog.id}`] = blog.name;
    }
  });

  watch(postData, post => {
    if (post?.id && post.blogId) {
      nameCache.value[`post:${post.blogId}:${post.id}`] = post.title;
    }
  });

  // --- Breadcrumb Assembly ---

  const breadcrumbItems = computed(() => {
    const items: Array<{ title: string; disabled: boolean; to?: string }> = [
      { title: 'Dina', disabled: false, to: '/' }
    ];

    if (route.path.startsWith('/photos/')) {
      items.push({ title: 'Fotos', disabled: false });
    }

    for (const record of route.matched) {
      if (record.path === '/') continue;

      const titleMeta = (record.meta as any)?.breadcrumb as string | undefined;
      let title = titleMeta ?? record.name?.toString() ?? '';

      // Safely access route.params properties
      const currentId = typeof (route.params as any).id === 'string' ? ((route.params as any).id as string) : undefined;
      const currentPostId =
        typeof (route.params as any).postId === 'string' ? ((route.params as any).postId as string) : undefined;

      if (record.path.includes(':id') && currentId) {
        title = nameCache.value[`profile:${currentId}`] || nameCache.value[`blog:${currentId}`] || title;
      }
      if (record.path.includes(':postId') && currentPostId && currentId) {
        title = nameCache.value[`post:${currentId}:${currentPostId}`] || title;
      }

      // Simple title case for non-dynamic segments
      if (!titleMeta && !record.path.includes(':')) {
        title = record.path.split('/').findLast(Boolean)?.replace(/-/g, ' ') ?? '';
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      items.push({
        title,
        disabled: false, // Logic for disabling last item can be added here
        to: record.path
      });
    }

    // Disable the last item
    const last = items.at(-1);
    if (last) last.disabled = true;

    return items;
  });

  return { breadcrumbItems };
}
