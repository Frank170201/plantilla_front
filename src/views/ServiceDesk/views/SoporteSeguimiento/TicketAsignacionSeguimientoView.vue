<template>
  <v-container fluid>
    <v-card class="px-4 py-4 pb-4" v-if="ticket">
      <!-- Header con botón de regreso -->
      <v-card-title class="d-flex align-center">
        <v-btn
          icon
          variant="text"
          @click="router.push({ name: 'soporte-seguimiento' })"
          class="mr-2"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-icon class="mr-2">mdi-ticket-confirmation</v-icon>
        <span class="font-weight-bold mr-2 text-uppercase">
          Detalle del Ticket #{{ ticket.id }}
        </span>
      </v-card-title>

      <v-row>
        <!-- Columna principal del contenido -->
        <v-col cols="12" md="8">
          <!-- Información del ticket -->
          <v-card-subtitle class="text-h5 font-weight-bold mb-2">
            {{ ticket.asunto }}
          </v-card-subtitle>

          <!-- Información básica en chips -->
          <div class="d-flex flex-wrap mb-4" style="gap: 8px">
            <v-chip variant="outlined">
              <v-icon start>mdi-tag</v-icon>
              {{ ticket.tipo?.nombre }}
            </v-chip>
            <v-chip v-if="ticket.comercio" variant="outlined">
              <v-icon start>mdi-warehouse</v-icon>
              {{ ticket.comercio?.nombre }}
            </v-chip>
            <v-chip variant="outlined">
              <v-icon start>mdi-calendar</v-icon>
              {{ dayjs(ticket.created_at).format("DD/MM/YYYY hh:mm a") }}
            </v-chip>
            <v-chip :color="ticket.estado?.color" variant="outlined">
              <v-icon :icon="ticket.estado?.icono" start></v-icon>
              {{ ticket.estado?.nombre }}
            </v-chip>
          </div>

          <AppCountdown
            v-if="ticket.fecha_asignacion"
            :estado-ticket="ticket.estado"
            :tiempo-restante="ticket.tiempo_restante"
          />

          <v-divider class="mb-6"></v-divider>

          <!-- Timeline de conversación -->
          <!-- <div> -->
            <div class="conversation-scroll">
              <!-- Mensaje inicial del solicitante -->
              <div class="conversation-message">
                <div class="d-flex align-start">
                  <v-avatar size="40" class="mr-2" color="amber-darken-1">
                    <v-icon color="white">mdi-account</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex flex-wrap align-center justify-space-between mb-2 gap-2">
                      <div>
                        <v-chip size="x-small" color="orange" class="mr-2">
                          CLIENTE
                        </v-chip>
                        <span class="text-caption text-medium-emphasis">
                          {{ fromNow(ticket.created_at).toUpperCase() }}
                        </span>
                      </div>
                      <v-chip size="small" color="blue" variant="outlined">
                        DESCRIPCIÓN
                      </v-chip>
                    </div>
                    <div class="message-bubble client-message">
                      <TraductorHtml
                        v-for="(estructura, index) in ticket.descripcion"
                        :key="index"
                        :estructura="estructura"
                      />
  
                      <!-- Adjuntos del ticket inicial -->
                      <div v-if="ticket.adjuntos?.length" class="attachments-section">
                        <div class="d-flex align-center">
                          <span class="text-caption text-medium-emphasis">
                            Archivos
                          </span>
                        </div>
                        <div class="attachments-container">
                          <div
                            v-for="archivo in ticket.adjuntos"
                            :key="archivo.id"
                            class="attachment-item d-flex align-center pa-2 mb-1 rounded hover-attachment"
                            @click="descargarArchivo(archivo)"
                          >
                            <v-icon size="small" class="mr-2 text-medium-emphasis">
                              {{ getFileIcon(getFileExtension(archivo.nombre_archivo)) }}
                            </v-icon>
                            <span class="text-break">{{ archivo.nombre_archivo }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Comentarios dinámicos -->
              <v-divider class="mb-6"></v-divider>

              <div v-if="ticket.comentarios?.length" class="d-flex align-center">
                <v-icon class="mr-2">mdi-message-text-outline</v-icon>
                <span class="text-h6 font-weight-bold">Conversación</span>
              </div>

              <div
                v-for="comentario in ticket.comentarios"
                :key="comentario.id"
                class="conversation-message"
                style="position: relative;"
              >
                <div class="d-flex align-start">
                  <v-avatar
                    size="40"
                    class="mr-2"
                    :color="esAgente(comentario.usuario) ? 'green-darken-3' : 'amber-darken-1'"
                  >
                    <v-icon color="white">
                      {{ esAgente(comentario.usuario) ? "mdi-account-tie" : "mdi-account" }}
                    </v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex flex-wrap align-center justify-space-between mb-2 gap-2">
                      <div>
                        <v-chip
                          size="x-small"
                          :color="esAgente(comentario.usuario) ? 'success' : 'orange'"
                          class="mr-2"
                        >
                          {{ esAgente(comentario.usuario) ? "AGENTE" : "CLIENTE" }}
                        </v-chip>
                        <span class="text-caption text-medium-emphasis">
                          {{ fromNow(comentario.created_at).toUpperCase() }}
                        </span>
                      </div>
                      <v-chip
                        v-if="comentario.es_solucion && ticket.id_estado === 5"
                        size="small"
                        :color="ticket?.estado?.color"
                        variant="outlined"
                      >
                        SOLUCIÓN
                      </v-chip>
                    </div>
                    <div class="message-bubble client-message">
                      <TraductorHtml
                        v-for="(estructura, index) in comentario.comentario"
                        :key="index"
                        :estructura="estructura"
                      />
  
                      <!-- Adjuntos de comentarios -->
                      <div v-if="comentario.adjuntos?.length" class="attachments-section">
                        <div class="attachments-header d-flex align-center mb-2">
                          <span class="text-caption text-medium-emphasis">
                            Archivos
                          </span>
                        </div>
                        <div class="attachments-container">
                          <div
                            v-for="archivo in comentario.adjuntos"
                            :key="archivo.id"
                            class="attachment-item d-flex align-center pa-2 mb-1 rounded hover-attachment"
                            @click="descargarArchivo(archivo)"
                          >
                            <v-icon size="small" class="mr-2 text-medium-emphasis">
                              {{ getFileIcon(getFileExtension(archivo.nombre_archivo)) }}
                            </v-icon>
                            <span class="text-break">{{ archivo.nombre_archivo }}</span>
                          </div>
                        </div>
                      </div>
                      <!-- Tarjeta flotante con los íconos -->
                      <div
                        v-if="ticket.id_estado !== 5"
                        class="comentario-floating-actions"
                        :style="{
                          backgroundColor: comentario.es_solucion
                            ? '#2e7d32'
                            : '#fafafa',
                          color: comentario.es_solucion ? 'white' : 'black',
                        }"
                      >
                        <v-tooltip
                          text="Marcar como solución"
                          location="top"
                          content-class="bg-success"
                          open-on-click
                        >
                          <template #activator="{ props }">
                            <v-icon 
                              v-bind="props" 
                              :icon="'mdi-check'"
                              
                              @click="handleMarcarComoSolucion(comentario)"
                            />
                          </template>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Nueva respuesta -->
              <div v-if="puedeResponder" class="conversation-message">
                <div class="d-flex align-start">
                  <v-avatar size="40" class="mr-2" :color="esAgente(ticket?.agente) ? 'green-darken-3' : 'amber-darken-1'">
                    <v-icon color="white">{{ esAgente(ticket?.agente) ? "mdi-account-tie" : "mdi-account" }}</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <EditorTextoEnriquecido
                      placeholder="Escriba una respuesta aquí..."
                      v-model="commentForm.descripcion"
                    >
                      <template #actions="{ disabled }">
                        <div class="d-flex flex-wrap align-center justify-space-between">
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            @click="togglePhotoUpload"
                            :disabled="disabled"
                          >
                            <v-icon>mdi-paperclip</v-icon>
                          </v-btn>

                          <div class="d-flex align-center">
                            <v-checkbox
                              v-model="marcarComoSolucion"
                              label="Solución"
                              density="comfortable"
                              class="mr-2 text-caption"
                              hide-details
                              color="success"
                              :disabled="disabled || isEmptyDescripcion"
                            />
                            <v-btn
                              class="bg-blueDinac"
                              @click="handleCrearComentario"
                              :disabled="disabled || isEmptyDescripcion"
                            >
                              Responder
                            </v-btn>
                          </div>
                        </div>
                      </template>
                    </EditorTextoEnriquecido>
  
                    <v-expand-transition>
                      <div v-show="showPhotoUpload" class="mt-3">
                        <PhotoUploadComponent
                          :key="photoUploadKey"
                          @files-selected="onCommentFilesSelected"
                          file-type-mode="all"
                        />
                      </div>
                    </v-expand-transition>
                  </div>
                </div>
              </div>
  
              <!-- Mensaje cuando no hay comentarios adicionales -->
              <div v-if="!ticket.comentarios?.length" class="text-center py-6">
                <v-icon color="grey-lighten-2">mdi-message-outline</v-icon>
                <span class="text-grey-lighten-1 mt-2">
                  No hay comentarios adicionales
                </span>
              </div>
            </div>
          <!-- </div> -->
        </v-col>

        <!-- Sidebar con información adicional -->
        <v-col cols="12" md="4">
          <div class="mb-6">
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2">mdi-account-circle</v-icon>
              <h5 class="text-h6 font-weight-bold">Asignación</h5>
            </div>

            <div class="mb-2">
              <div class="font-weight-bold">{{ ticket.cliente?.email }}</div>
              <v-chip size="x-small" color="orange" class="mr-2">CLIENTE</v-chip>
            </div>

            <div class="mb-2">
              <div class="font-weight-bold">
                {{ ticket.agente?.email || "Aún no asignado" }}
              </div>
              <v-chip size="x-small" color="success" class="mr-2">AGENTE</v-chip>
            </div>

            <FiltrosSticky
              v-if="validarRoles(['ROLE_ADMIN'])"
              :title="ticket.agente?.email ? 'Reasignar' : 'Asignar'"
              :icon="
                ticket.agente?.email
                  ? 'mdi-account-arrow-right'
                  : 'mdi-account-plus'
              "
            >
              <v-row dense align="center">
                <v-col cols="12" sm="6" md="8">
                  <v-autocomplete
                    v-model="agenteId"
                    item-title="email"
                    item-value="id"
                    :items="agentes"
                    label="Agente"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    color="primario-1"
                    size="large"
                    class="flex-grow-1"
                    @click="handleAsignarAgente"
                  >
                    {{ ticket.agente?.email ? 'Reasignar' : 'Asignar' }}
                  </v-btn>
                </v-col>
              </v-row>
            </FiltrosSticky>

            <v-btn
              v-if="!validarRoles(['ROLE_ADMIN']) && !esAgente(usuarioActual)"
              color="primario-1"
              prepend-icon="mdi-account-plus"
              @click="handleAsignarAgente"
            >
              Asignar a mí
            </v-btn>
          </div>

          <v-divider class="mb-6" />

          <div class="mb-6">
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2">mdi-clock-outline</v-icon>
              <h5 class="text-h6 font-weight-bold">Cronología</h5>
            </div>

            <div class="conversation-scroll">
              <div
                v-for="(item, index) in historial"
                :key="index"
                class="info-item mb-3"
              >
                <div class="text-caption text-medium-emphasis">
                  <!-- Si es el primer elemento, mostramos "Creado" -->
                  <template v-if="index === 0"> Creado </template>
                  <!-- Para el resto, mostramos el cambio de estado -->
                  <template v-else>
                    <strong>{{ limpiarTexto(item?.usuario?.email) }}</strong>
                    cambió el estado de
                    <strong>{{ item.estado_anterior || "ninguno" }}</strong>
                    a
                    <strong>{{ item.estado_nuevo }}</strong>
                  </template>
                </div>

                <div class="text-caption text-medium-emphasis">
                  {{ fromNow(item.created_at).toUpperCase() }}
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <VisualizadorPDF
        v-model="dialogPreviewPdf"
        :data-url="adjuntoDataUrl"
        :action="true"
      />

      <VisualizadorImagen v-model="dialogPreviewImagen" :src="adjuntoDataUrl" />
    </v-card>
  </v-container>
</template>


<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import TraductorHtml from "@/components/utils/contenidoTextual/tipos/TraductorHtml.vue";
import EditorTextoEnriquecido from "@/components/utils/EditorTextoEnriquecido.vue";
import PhotoUploadComponent from "@/components/PhotoUploadComponent.vue";
import FiltrosSticky from "@/components/FiltrosSticky.vue";
import useServiceDesk from "../../composables/useServiceDesk";
import { limpiarTexto } from "@/utils/data";
import { fromNow } from "@/utils/datetime";
import AppCountdown from "@/components/AppCountdown.vue";
import { VisualizadorImagen, VisualizadorPDF } from "@/components/utils";

const route = useRoute();

const {
  usuarioActual,
  ticket,
  historial,
  agentes,
  router,
  commentForm,
  showPhotoUpload,
  photoUploadKey,
  marcarComoSolucion,
  agenteId,
  puedeResponder,
  isEmptyDescripcion,
  adjuntoDataUrl,
  dialogPreviewPdf,
  dialogPreviewImagen,
  getFileExtension,
  getFileIcon,
  esAgente,
  validarRoles,
  togglePhotoUpload,
  onCommentFilesSelected,
  descargarArchivo,
  obtenerAgentes,
  obtenerDetalleTicket,
  obtenerHistorialTicket,
  crearComentario,
  marcarComentarioComoSolucion,
  asignarAgente
} = useServiceDesk();

const handleCrearComentario = () => {
  crearComentario(route.params.id);
};

const handleMarcarComoSolucion = (comentario) => {
  marcarComentarioComoSolucion(
    route.params.id, 
    comentario.id, 
    !comentario.es_solucion
  );
};

const handleAsignarAgente = () => {
  asignarAgente(route.params.id);
};

onMounted(() => {
  obtenerDetalleTicket(route.params.id);
  obtenerHistorialTicket(route.params.id);
  obtenerAgentes();
});
</script>

<style scoped>
.conversation-message {
  padding: 12px 0;
}

.conversation-message:last-child {
  border-bottom: none;
}

.message-bubble {
  background: #f5f5f5;
  padding: 16px 20px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 14px;
}

.client-message {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.agent-message {
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
}

.hover-bg:hover {
  background-color: rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

@media (max-width: 960px) {
  .conversation-message {
    padding: 16px 0;
  }
}

.attachments-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  margin-top: 12px;
}

.attachments-container {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 4px;
}

.attachment-item {
  background: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hover-attachment:hover {
  background-color: #f5f5f5;
  border-color: #1976d2;
}

.conversation-scroll {
  max-height: 60vh; /* ajusta según el espacio que quieras */
  overflow-y: auto;
  padding-right: 8px; /* un poco de espacio para que no tape el scroll */
}

/* Opcional: estilizar scroll en navegadores modernos */
.conversation-scroll::-webkit-scrollbar {
  width: 6px;
}

.conversation-scroll::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 4px;
}

.conversation-scroll::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}

.comentario-floating-actions {
  position: absolute;
  right: 0;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
}


</style>
