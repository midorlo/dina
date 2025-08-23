import type { MenuItem } from '@/types/menuData';
import { menuData, Role } from '@/data/mock-data.ts';
import { filterMenuByRole } from '@/stores/auth';

export function getMenuItems(role: Role, userId?: string): MenuItem[] {
  const r = role || Role.Guest;
  const items = filterMenuByRole(menuData, r).map((item: any) => ({
    ...item,
    to: typeof item.to === 'function' ? item.to(userId) : item.to
  }));

  return items.filter((item: MenuItem, index: number, array: MenuItem[]) => {
    if ((item as any).type !== 'divider') return true;
    const prev = array[index - 1] as any;
    const next = array[index + 1] as any;
    return prev && prev.type !== 'divider' && next && next.type !== 'divider';
  });
}
