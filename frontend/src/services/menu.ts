import { menuData } from '@/data/mock-data.ts';
import { filterMenuByRole } from '@/stores/auth';
import { type MenuItem, Role } from '@/types';

export function getMenuItems(role: Role, userId?: string): ProcessedMenuItem[] {
  const items = filterMenuByRole(menuData, role || Role.Guest).map((item: any) => ({
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
