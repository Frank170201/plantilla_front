<template>
  <v-dialog :model-value="props.showDialog" persistent max-width="600">
    <v-card class="profile-dialog rounded-lg">
      <v-card-text class="text-center pt-6">
        <v-avatar size="80" :image="defaultUser" class="position-relative mb-4">
        </v-avatar>

        <h2 class="text-h5 font-weight-bold mb-2 color-primario-1">
          {{ displayName }}
        </h2>

        <p class="text-body-2 text-grey mb-5">
          {{ userInformation?.email }}
        </p>

        <v-btn
          variant="outlined"
          rounded
          color="blueDinac"
          class="px-6 mb-6"
          @click="manageAccount"
        >
          Actualizar contraseña
        </v-btn>

        <v-divider class="mb-5"></v-divider>

        <div class="text-left px-4 mb-5">
          <div class="d-flex align-center mb-3">
            <v-icon class="mr-3">mdi-account</v-icon>
            <div>
              <p class="text-body-2 text-grey mb-0">Usuario</p>
              <p class="mb-0">{{ userInformation?.email ?? "" }}</p>
            </div>
          </div>

          <div class="d-flex align-center mb-3" v-if="roles.length">
            <v-icon class="mr-3">mdi-shield-account</v-icon>
            <div>
              <p class="text-body-2 text-grey mb-0">Roles</p>
              <p class="mb-0">{{ roles.join(", ") }}</p>
            </div>
          </div>

          <div class="d-flex align-center mb-3" v-if="userInformation?.last_login">
            <v-icon class="mr-3">mdi-clock-outline</v-icon>
            <div>
              <p class="text-body-2 text-grey mb-0">Último ingreso</p>
              <p class="mb-0">{{ userInformation.last_login }}</p>
            </div>
          </div>
        </div>

        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="closeDialog">Cerrar</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <AppUpdatePasswordComponent v-model="showChangePasswordDialog" />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import defaultUser from "../assets/img/user-default.png";
import AppUpdatePasswordComponent from "@/components/AppUpdatePasswordComponent.vue";
import { useAuthStore } from "@/store/auth";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
});

const auth = useAuthStore();
const userInformation = ref(null);
const showChangePasswordDialog = ref(false);

const emit = defineEmits(["update:modelValue", "onConfirm"]);

const userProfile = async () => {
  // En SICAF la información del usuario viene del store de auth (cargado del JWT)
  userInformation.value = auth.user || null;
};

const roles = computed(() => {
  return auth.roles || [];
});

const displayName = computed(() => {
  return userInformation.value?.email?.split("@")[0] || "Usuario";
});

const closeDialog = () => {
  emit("update:modelValue", false);
};

const manageAccount = () => {
  showChangePasswordDialog.value = true;
};

defineExpose({
  userProfile,
});
</script>
