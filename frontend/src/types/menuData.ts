import type { Role } from '@/types/index.ts';

interface MenuItemBase {
  title?: string;
  prependIcon?: string;
  prependAvatar?: string;
  appendIcon?: string;
  disabled?: boolean;
  link?: boolean;
  roles?: Role[];
  type?: 'divider';
}

export interface MenuItemInput extends MenuItemBase {
  to?: string | ((id: string | undefined) => string);
}

export interface MenuItem extends MenuItemBase {
  to?: string;
}
