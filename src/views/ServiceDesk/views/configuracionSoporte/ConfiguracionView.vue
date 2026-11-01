<template>
  <v-container fluid>
    <v-card class="px-4 py-4 pb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-headphones-settings</v-icon>
        <span class="font-weight-bold mr-2 text-uppercase">
          Configuración de Soporte y Atención
        </span>
      </v-card-title>

      <AppTabComponent :content_tabs="tabs">
        <template #tab-0>
          <v-sheet class="pa-4" color="white" elevation="2" rounded="lg">
            <TableComponent
              :config="tableConfigDiasAsueto"
              :loading="loading"
              @update:options="reloadAsuetos"
            >
              <template #top>
                <div class="d-flex flex-wrap align-center justify-end gap-2">
                  <v-btn class="bg-blueDinac" @click="openDialogAsueto">
                    <v-icon>mdi-plus</v-icon> Agregar Día de Asueto
                  </v-btn>
                </div>
              </template>

              <!-- Template para las acciones de la tabla -->
              <template v-slot:[`item.acciones`]="{ item }">
                <AppVMenuComponent
                  :items_btn="accionesDiasAsueto(item)"
                  :item="item"
                />
              </template>
            </TableComponent>
          </v-sheet>
        </template>

        <template #tab-1>
          <v-sheet class="pa-4" color="white" elevation="2" rounded="lg">
            <TableComponent
              :config="tableConfigDiasHabiles"
              :loading="loading"
              @update:options="reloadDiasLaborales"
            >
              <template #top>
                <div class="d-flex flex-wrap align-center justify-end gap-2">
                  <v-btn class="bg-blueDinac" @click="openDialogHorario">
                    <v-icon>mdi-plus</v-icon> Agregar Día Laboral
                  </v-btn>
                </div>
              </template>

              <!-- Template para las acciones de la tabla de horarios -->
              <template v-slot:[`item.acciones`]="{ item }">
                <AppVMenuComponent
                  :items_btn="accionesDiasHabiles(item)"
                  :item="item"
                />
              </template>
            </TableComponent>
          </v-sheet>
        </template>
      </AppTabComponent>

      <AppDialogComponent
        v-model="showDialog"
        :title="dialogTitle"
        :showSaveButton="true"
        @save="handleSave"
        @update:modelValue="closeDialog"
      >
        <!-- FORMULARIO DE ASUETO -->
        <div v-if="dialogType === 'asueto'">
          <v-row>
            <v-col cols="12" md="6">
              <v-date-input
                v-model="formAsueto.fecha"
                v-bind="validarPropiedades($vFormAsueto.fecha, 'Seleccionar fecha')"
                placeholder="Seleccionar fecha"
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="formAsueto.descripcion"
                v-bind="validarPropiedades($vFormAsueto.descripcion, 'Descripción del día de asueto')"
                label="Descripción *"
                variant="outlined"
                density="comfortable"
                maxlength="255"
                counter
              />
            </v-col>
          </v-row>
        </div>

        <!-- FORMULARIO DE HORARIO -->
        <div v-if="dialogType === 'horario'">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="formHorario.selectedDay"
                v-bind="validarPropiedades($vFormHorario.selectedDay, 'Seleccionar día')"
                :items="[
                  'Lunes',
                  'Martes',
                  'Miércoles',
                  'Jueves',
                  'Viernes',
                  'Sábado',
                  'Domingo',
                ]"
                label="Día *"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formHorario.startTime"
                v-bind="validarPropiedades($vFormHorario.startTime, 'Hora de entrada')"
                label="Hora de entrada *"
                variant="outlined"
                type="time"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formHorario.endTime"
                v-bind="validarPropiedades($vFormHorario.endTime, 'Hora de salida')"
                label="Hora de salida *"
                variant="outlined"
                type="time"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </div>
      </AppDialogComponent>

      <AppDialogoConfirmComponent
        v-model="confirmDialog"
        :title="confirmModal.title"
        :callback="confirmModal.callback"
        @onConfirm="confirmModal.onConfirmAction"
        :descripcion="confirmModal.description"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { VDateInput } from "vuetify/labs/VDateInput";
import AppTabComponent from "@/components/AppTabComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import AppDialogComponent from "@/components/AppDialogComponent.vue";
import useAsueto from "../../composables/useAsueto";
import AppVMenuComponent from "@/components/AppVMenuComponent.vue";
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";

const {
  loading,
  tabs,
  showDialog,
  confirmDialog,
  confirmModal,
  dialogType,
  formAsueto,
  formHorario,
  tableConfigDiasAsueto,
  tableConfigDiasHabiles,
  reloadAsuetos,
  reloadDiasLaborales,
  openDialogAsueto,
  openDialogHorario,
  accionesDiasHabiles,
  accionesDiasAsueto,
  closeDialog,
  $vFormAsueto,
  $vFormHorario,
  validarPropiedades,
  dialogTitle,
  handleSave,
} = useAsueto();

</script>
