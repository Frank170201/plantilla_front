<template>
  <!-- Menú de usuario -->
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <div style="display: flex; justify-content: center; align-items: center;">
        <v-btn
          v-bind="props"
          class="d-flex align-center pa-0"
          style="min-width: unset; color: #1f384c"
        >
          <v-avatar color="#043432" size="30"></v-avatar>
          <span
            class="d-none d-md-inline ml-2"
            style="font-size: 12px; font-weight: 700; color: #1f384c"
          >
            {{ auth.user?.email }}
          </span>
          <v-icon class="ml-1">mdi-chevron-down</v-icon>
        </v-btn>
      </div>
    </template>

    <v-card min-width="300" elevation="0" class="mt-4">
      <v-list>
        <v-list-item @click="profile">
          <template #prepend>
            <v-icon>mdi-account-box-outline</v-icon>
          </template>
          <v-list-item-title>Editar perfil</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <AppProfileComponent
      v-model:showDialog="showProfileModal"
      ref="userProfile"
    />
  </v-menu>
</template>

<script setup>
import AppProfileComponent from "@/components/AppProfileComponent.vue";
import { useAuthStore } from "@/store/auth";
import { ref } from "vue";

const auth = useAuthStore();
const menu = ref(false);
const showProfileModal = ref(false);
const userProfile = ref(null);

const logout = () => {
  auth.logout();
};

const profile = () => {
  if (userProfile.value?.userProfile) {
    userProfile.value.userProfile();
  }
  showProfileModal.value = true;
  menu.value = false;
};
</script>

<style scoped>
:deep(.v-list) {
  background: #F5F5F5 !important;
  padding: 2%;
}

:deep(.v-list .v-list-item) {
  border-radius: 5% !important;
  color: #7E7E7E !important;
}

:deep(.v-list-item__prepend) {
  color: #000 !important;
}

:deep(.v-list .v-list-item:hover) {
  background: #DADADA;
  color: #000 !important;
}
</style>
