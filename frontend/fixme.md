# TypeScript Build Errors (FIXME)

During the build process (`npm run build`), several TypeScript errors are consistently occurring, primarily related to type inference in Vue templates, especially when dealing with `vue-router`'s `route.params` and Vuetify component slots.

## Remaining Errors:

### 1. `Property 'id' does not exist on type 'Record<never, never> | ...'`

**Symptom:** This error appears in the template when trying to access `id` or `postId` properties from `route.params` or objects derived from them, even after explicit type assertions in the `<script setup>` block.

**Affected Files:**
- `src/pages/blogs/[id]/index.vue` (Line 56, column 44: `:to="`/blogs/${currentBlog.id}/posts/${String(post.id)}`"`)
- `src/pages/blogs/[id]/posts/[postId].vue` (Line 50, column 44: `:to="`/blogs/${blogId}/posts/${post.id}`"` and Line 51, column 44: `Property 'postId' does not exist`)

**Details:**
- In these files, `blogId` and `postId` are computed properties derived from `route.params`. Although they are explicitly cast to `string` in the script, the Vue template compiler seems to lose this type information, leading to `TS2339` errors.
- Attempts to fix:
  - Direct casting `route.params.id as string`.
  - Using computed properties for `blogId` and `postId`.
  - Explicitly typing the `blog` and `post` refs with interfaces (`Blog`, `PostItem`) that include `id` and `blogId` as `string`.
  - Defining specific interfaces for `route.params` (e.g., `BlogRouteParams`, `PostRouteParams`) and casting `route.params` to these interfaces.
  - Using `String(post.id)` in the template for numeric IDs.

**Root Cause (Hypothesis):** The Vue template compiler's type inference might not be robust enough to carry over complex type assertions from the `<script setup>` context to the template, especially for nested properties or dynamic route parameters. It might be reverting to a broader, less specific type for `route.params` in the template context.

### 2. `Property 'lazy-content' does not exist on type 'Readonly<{ default?: ... }>'`

**Symptom:** This error appears in `src/pages/gallery.vue` related to the `v-img` component's `lazy-content` slot.

**Affected File:**
- `src/pages/gallery.vue` (Line 23, column 30: `<template v-slot:lazy-content>`)

**Details:**
- The `v-img` component uses a slot named `lazy-content` to display a loading indicator. TypeScript is reporting that this property does not exist on the component's type definition.
- Attempts to fix:
  - Changing `<template #lazy-content>` to `<template v-slot:lazy-content>`.
  - Adding `as any` to the `v-img` component (`<v-img as any ...>`). This was a temporary workaround that did not resolve the type error during build.

**Root Cause (Hypothesis):** The type definitions for Vuetify's `v-img` component might not fully expose or correctly type its slots, leading to a mismatch between the actual usage and the TypeScript definition. This might require a custom type declaration for the `v-img` component or a more advanced configuration of Vue's Volar plugin.

## Next Steps for Resolution (Suggested):

1.  **Deep Dive into Vue/TypeScript Template Inference:** Research more advanced techniques for ensuring type correctness in Vue templates, especially with `vue-router` params. This might involve custom `d.ts` files for route params or specific compiler options.
2.  **Vuetify `v-img` Slot Typing:** Investigate Vuetify's official documentation or community forums for known issues or recommended patterns for typing `v-img` slots. If no direct solution, consider creating a custom type declaration for `v-img`.
3.  **Consider a simpler approach for `lazy-content`:** If typing the slot proves too complex, an alternative could be to implement the lazy loading logic manually or use a different component that is better typed.

This `fixme.md` file should be reviewed by someone with deep expertise in Vue 3, TypeScript, and `vue-router`'s advanced typing features, as well as Vuetify's component typing.