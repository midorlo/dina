import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: string
    requiresGuest?: boolean
    roles?: string[] // Assuming Role is a string enum or string literal type
    layout?: string
  }
}
