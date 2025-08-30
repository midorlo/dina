<template>
  <div class="avatar-extended">
    <v-menu v-if="menu">
      <template #activator="{ props: menuProps }">
        <v-avatar v-bind="{ ...$attrs, ...menuProps }">
          <slot />
        </v-avatar>
      </template>
      <v-list>
        <v-list-item v-if="profileLink" link title="Profil" :to="profileLink" />
        <v-list-item v-if="messageLink" link title="Nachricht schreiben" :to="messageLink" />
      </v-list>
    </v-menu>
    <v-avatar v-else v-bind="$attrs">
      <slot />
    </v-avatar>
    <span v-if="online" class="online-indicator" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

interface Props {
  online?: boolean;
  menu?: boolean;
  profileLink?: string;
  messageLink?: string;
}

withDefaults(defineProps<Props>(), {
  online: false,
  menu: false
});
</script>

<style scoped>
.avatar-extended {
  position: relative;
  display: inline-block;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background-color: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
}
</style>
