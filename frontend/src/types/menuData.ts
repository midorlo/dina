import type { Role } from '@/types/index.ts'

export interface MenuItem {
  title?: string
  prependIcon?: string
  prependAvatar?: string
  appendIcon?: string
  disabled?: boolean
  link?: boolean
  to?: string | ((id: string | undefined) => string)
  roles?: Role[]
  type?: 'divider'
}
