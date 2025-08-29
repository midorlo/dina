import type { MenuItem, MenuItemInput } from '@/types/menuData';
import logo from '@/assets/medina-logo.webp';
import { filterMenuByRole } from '@/stores/auth';
import { Role } from '@/types/auth';

// This is static application configuration, not mock data.
export const menuData: Readonly<MenuItemInput[]> = [
  { prependAvatar: logo, title: 'Dina', to: '/' },
  { type: 'divider' },
  { title: 'Messages', prependIcon: 'mdi-message-text-outline', to: '/conversations', roles: [Role.User] },
  { title: 'Notifications', prependIcon: 'mdi-bell-outline', to: '/notifications', roles: [Role.User] },
  { title: 'Login', prependIcon: 'mdi-login', to: '/login', roles: [Role.Guest] },
  { title: 'Register', prependIcon: 'mdi-account-plus', to: '/register', roles: [Role.Guest] },
  { title: 'Community', prependIcon: 'mdi-account-group-outline', to: '/profiles' },
  { title: 'Blogs', prependIcon: 'mdi-post-outline', to: '/blogs' },
  { type: 'divider' },
  {
    title: 'Photos',
    prependIcon: 'mdi-image-multiple',
    to: (id: string | undefined) => `/photos/${id || ''}`,
    roles: [Role.User]
  },
  { type: 'divider' },
  { title: 'Error 401', prependIcon: 'mdi-alert-circle-outline', to: '/error/401', roles: [Role.Developer] },
  { title: 'Error 403', prependIcon: 'mdi-alert-octagon-outline', to: '/error/403', roles: [Role.Developer] },
  { title: 'Error 404', prependIcon: 'mdi-alert-box-outline', to: '/error/404', roles: [Role.Developer] },
  { title: 'Error 500', prependIcon: 'mdi-alert-decagram-outline', to: '/error/500', roles: [Role.Developer] }
] as const;

export function getMenuItems(role: Role, userId?: string): MenuItem[] {
  const r = role || Role.Guest;
  const items = filterMenuByRole(menuData, r).map((item: MenuItemInput) => ({
    ...item,
    to: typeof item.to === 'function' ? item.to(userId) : item.to
  }));

  // Filter out consecutive dividers
  return items.filter((item: MenuItem, index: number, array: MenuItem[]) => {
    if ((item as any).type !== 'divider') return true;
    const prev = array[index - 1] as any;
    const next = array[index + 1] as any;
    return prev && prev.type !== 'divider' && next && next.type !== 'divider';
  });
}
