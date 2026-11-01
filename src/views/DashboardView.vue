<template>
  <v-container class="dashboard-container">
    <v-row align="center" justify="center" class="header-row mb-8">
      <v-col cols="12" md="7" class="centers-cols">
        <h1 class="text-h2 font-weight-bold mb-4 titulo-principal">
          Bienvenido a <br />
          SICAF
        </h1>
        <p class="subtitulo mb-6">
          Sistema de Control de Activo Fijo. Administra los bienes
          institucionales, traslados, custodios e inventarios desde un solo
          lugar.
        </p>
      </v-col>
      <v-col cols="12" md="5" class="d-flex justify-center centers-cols">
        <v-icon size="200" color="#00D6BD">mdi-package-variant-closed</v-icon>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" sm="6">
        <v-card class="card-stat" elevation="2">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="#00D6BD" class="mr-4">
                mdi-clipboard-list
              </v-icon>
              <div>
                <p class="text-caption text-grey-darken-1 mb-0">Total activos</p>
                <h3 class="text-h5 font-weight-bold color-primario">--</h3>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card class="card-stat" elevation="2">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="#00D6BD" class="mr-4">
                mdi-warehouse
              </v-icon>
              <div>
                <p class="text-caption text-grey-darken-1 mb-0">En bodega</p>
                <h3 class="text-h5 font-weight-bold color-primario">--</h3>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card class="card-stat" elevation="2">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="#00D6BD" class="mr-4">
                mdi-account-hard-hat
              </v-icon>
              <div>
                <p class="text-caption text-grey-darken-1 mb-0">Custodios</p>
                <h3 class="text-h5 font-weight-bold color-primario">--</h3>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card class="card-stat" elevation="2">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" color="#00D6BD" class="mr-4">
                mdi-truck
              </v-icon>
              <div>
                <p class="text-caption text-grey-darken-1 mb-0">Traslados</p>
                <h3 class="text-h5 font-weight-bold color-primario">--</h3>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="card-info" elevation="0">
          <v-card-text>
            <h2 class="text-h6 font-weight-bold mb-2 color-primario">
              Comenzá por aquí
            </h2>
            <p class="text-body-2 mb-4">
              Explora los módulos del sistema desde el menú lateral. Usa
              "Activo Fijo" para registrar y consultar bienes, "Catálogos"
              para administrar categorías y ubicaciones, y "Administración"
              para configurar usuarios y permisos.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  localStorage.removeItem("sesionCerrada");
});
</script>

<style scoped>
.dashboard-container {
  padding: 2% 4% !important;
}

.titulo-principal {
  color: #043432;
  letter-spacing: -1px;
}

.subtitulo {
  color: #043432;
  max-width: 540px;
  font-size: 1rem;
  line-height: 1.5;
}

.color-primario {
  color: #043432 !important;
}

.card-stat {
  border-radius: 12px !important;
  border: 1px solid #E0E0E0;
}

.card-info {
  background-color: #F6F6FB !important;
  border-radius: 12px !important;
  border: 1px solid #E0E0E0;
}

@media screen and (max-width: 965px) {
  .centers-cols {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 16px;
  }
  .titulo-principal {
    font-size: 2.5rem !important;
  }
}
</style>
