import type { Ref } from 'vue'
import { onUnmounted, watchEffect } from 'vue'

export function useAutoScroll(elementRef: Ref<HTMLElement | null>) {
  const scrollToBottom = () => {
    const el = elementRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  let observer: MutationObserver | null = null

  watchEffect((onCleanup) => {
    const el = elementRef.value
    if (!el) return

    // Perform an initial scroll when element becomes available
    scrollToBottom()

    observer?.disconnect()
    observer = new MutationObserver(scrollToBottom)
    observer.observe(el, { childList: true, subtree: true })

    onCleanup(() => {
      observer?.disconnect()
      observer = null
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { scrollToBottom }
}
