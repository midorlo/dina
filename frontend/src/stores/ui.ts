import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarPinned: false
  }),
  actions: {
    toggleSidebarPinned() {
      this.sidebarPinned = !this.sidebarPinned;
    },
    setSidebarPinned(pinned: boolean) {
      this.sidebarPinned = pinned;
    }
  },
  persist: true
});
