import logo from '@/assets/logo.svg'
import { Role } from '@/types'

export interface MenuItem {
  title?: string
  prependIcon?: string
  prependAvatar?: string
  to?: string | ((id: string | undefined) => string)
  roles?: Role[]
  type?: 'divider'
}

export const menu: MenuItem[] = [
  {
    title: 'About',
    prependIcon: 'mdi-information-outline',
    to: '/about',
  },
  {
    title: 'Blogs',
    prependIcon: 'mdi-post-outline',
    to: '/blogs',
  },
  {
    title: 'Conversations',
    prependIcon: 'mdi-message-text-outline',
    to: '/conversations',
  },
  {
    title: 'Home',
    prependAvatar: logo,
    to: '/',
  },
  {
    title: 'Photos',
    prependIcon: 'mdi-image-multiple',
    to: (id) => `/photos/${id}`,
  },
  {
    title: 'Profiles',
    prependIcon: 'mdi-account-group-outline',
    to: '/profiles',
  },
  {
    title: 'Store',
    prependIcon: 'mdi-store',
    to: '/developer/store',
    roles: [Role.Developer],
  },
  { type: 'divider' },
  {
    title: 'Login',
    prependIcon: 'mdi-login',
    to: '/login',
    roles: [Role.Guest],
  },
  {
    title: 'Notifications',
    prependIcon: 'mdi-bell-outline',
    to: '/notifications',
    roles: [Role.User],
  },
  {
    title: 'Profile',
    prependIcon: 'mdi-account',
    to: (id) => `/profiles/${id}/edit`,
    roles: [Role.User],
  },
  {
    title: 'Register',
    prependIcon: 'mdi-account-plus',
    to: '/register',
    roles: [Role.Guest],
  },
  { type: 'divider' },
  {
    title: 'Error 401',
    prependIcon: 'mdi-alert-circle-outline',
    to: '/error/401',
  },
  {
    title: 'Error 403',
    prependIcon: 'mdi-alert-octagon-outline',
    to: '/error/403',
  },
  {
    title: 'Error 404',
    prependIcon: 'mdi-alert-box-outline',
    to: '/error/404',
  },
]
