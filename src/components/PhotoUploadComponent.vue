<template>
  <div>
    <div
      class="upload-area"
      :class="{ dragging: isDragging, 'has-files': selectedFiles.length > 0 }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <!-- Área de drag and drop -->
      <div v-if="selectedFiles.length === 0" class="upload-content">
        <div class="upload-icon">
          <v-icon size="50" color="grey-lighten-1">{{ getMainIcon() }}</v-icon>
        </div>
        <h3 class="upload-title">Arrastre y suelte archivos aquí</h3>
        <span>o</span>
        <v-btn class="d-flex align-center browse-button" variant="outlined">
          <v-icon class="mr-2">mdi-folder-open</v-icon>
          {{ getButtonText() }}
        </v-btn>
        <p class="upload-info">{{ getSupportedFormatsText() }}</p>
      </div>

      <!-- Vista previa de archivos seleccionados -->
      <div v-else class="files-preview">
        <div class="files-grid">
          <v-card
            v-for="file in selectedFiles"
            :key="file.id"
            class="file-item"
            flat
          >
            <div class="file-preview">
              <!-- Preview para imágenes -->
              <v-img 
                v-if="isImage(file)" 
                :src="file.preview" 
                class="file-image" 
                height="100" 
                cover
                :key="file.preview"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      size="24"
                    />
                  </v-row>
                </template>
                <template #error>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-icon size="40" color="grey">mdi-image-broken</v-icon>
                  </v-row>
                </template>
              </v-img>
              
              <!-- Preview para otros tipos de archivo -->
              <div v-else class="file-icon-preview">
                <v-icon size="40" :color="getFileTypeColor(file)">
                  {{ getFileTypeIcon(file) }}
                </v-icon>
                <span class="file-extension">{{ getFileExtension(file.name) }}</span>
              </div>
            </div>

            <v-card-text class="file-info pa-2">
              <p class="file-name" :title="file.name">{{ file.name }}</p>
              <p class="file-size">{{ formatFileSize(file.size) }}</p>
            </v-card-text>

            <v-btn
              class="remove-button"
              icon
              size="small"
              @click.stop="removeFile(file.id)"
            >
              <v-icon size="16">mdi-delete</v-icon>
            </v-btn>
          </v-card>
        </div>

        <div class="upload-actions">
          <v-btn class="browse-button secondary" variant="outlined">
            AGREGAR MÁS ARCHIVOS
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      multiple
      :accept="getAcceptAttribute()"
      @change="handleFileSelect"
      style="display: none"
    />

    <!-- Mensajes de error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";

// Props
const props = defineProps({
  acceptedTypes: {
    type: Array,
    default: () => ["image/jpeg", "image/png"],
  },
  fileTypeMode: {
    type: String,
    default: 'images', // 'images', 'documents', 'office', 'all', 'custom'
    validator: value => ['images', 'documents', 'office', 'all', 'custom'].includes(value)
  },
  customTypes: {
    type: Array,
    default: () => []
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB por defecto
  },
});

// Emits
const emit = defineEmits(["files-selected", "upload-requested"]);

// Reactive data
const isDragging = ref(false);
const selectedFiles = ref([]);
const errorMessage = ref("");
const fileInput = ref(null);
const fileIdCounter = ref(0); // Contador para generar IDs únicos
const objectUrls = ref(new Set()); // Rastrear URLs de objetos creadas

// Definiciones de tipos de archivo
const fileTypeConfigs = {
  images: {
    types: ["image/jpeg", "image/png"],
    icon: "mdi-image-multiple",
    buttonText: "Seleccionar fotos",
    formatText: "Formatos soportados: JPG, PNG"
  },
  office: {
    types: [
      // PDF
      "application/pdf",
      // Word
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      // Excel  
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      // PowerPoint
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.ms-powerpoint", // .ppt
      // LibreOffice/OpenOffice
      "application/vnd.oasis.opendocument.text", // .odt
      "application/vnd.oasis.opendocument.spreadsheet", // .ods
      "application/vnd.oasis.opendocument.presentation", // .odp
    ],
    icon: "mdi-microsoft-office",
    buttonText: "Seleccionar archivos Office",
    formatText: "Formatos soportados: Word, Excel, PowerPoint, LibreOffice"
  },
  all: {
    types: [], // Se llenará dinámicamente
    icon: "mdi-file-multiple",
    buttonText: "Seleccionar archivos",
    formatText: "Formatos soportados: Imágenes, Office, LibreOffice, PDF"
  }
};

// Computed para obtener los tipos de archivo actuales
const currentFileTypes = computed(() => {
  if (props.fileTypeMode === 'custom') {
    return props.customTypes.length > 0 ? props.customTypes : props.acceptedTypes;
  }
  
  if (props.fileTypeMode === 'all') {
    return [
      ...fileTypeConfigs.images.types,
      ...fileTypeConfigs.office.types
    ];
  }
  
  return fileTypeConfigs[props.fileTypeMode]?.types || props.acceptedTypes;
});

// Métodos para UI dinámica
const getMainIcon = () => {
  if (props.fileTypeMode === 'custom') return "mdi-file-multiple";
  return fileTypeConfigs[props.fileTypeMode]?.icon || "mdi-file-multiple";
};

const getButtonText = () => {
  if (props.fileTypeMode === 'custom') return "Seleccionar archivos";
  return fileTypeConfigs[props.fileTypeMode]?.buttonText || "Seleccionar archivos";
};

const getSupportedFormatsText = () => {
  if (props.fileTypeMode === 'custom') {
    if (props.customTypes.length > 0) {
      const extensions = props.customTypes.map(type => getExtensionFromMimeType(type)).join(', ');
      return `Formatos soportados: ${extensions}`;
    }
    return "Formatos personalizados";
  }
  return fileTypeConfigs[props.fileTypeMode]?.formatText || "Archivos soportados";
};

const getAcceptAttribute = () => {
  return currentFileTypes.value.join(',');
};

// Utilidades para tipos de archivo
const isImage = (file) => {
  return file.type.startsWith('image/');
};

const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase();
};

const getExtensionFromMimeType = (mimeType) => {
  const mimeToExt = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'image/jpeg': '.jpg',
    'image/png': '.png',
  };
  return mimeToExt[mimeType] || mimeType.split('/')[1].toUpperCase();
};


const getFileTypeIcon = (file) => {
  const ext = getFileExtension(file.name).toLowerCase();
  const iconMap = {
    pdf: 'mdi-file-pdf-box',
    doc: 'mdi-file-word-box',
    docx: 'mdi-file-word-box',
    xls: 'mdi-file-excel-box', 
    xlsx: 'mdi-file-excel-box',
    ppt: 'mdi-file-powerpoint-box',
    pptx: 'mdi-file-powerpoint-box',
    odt: 'mdi-file-document',
    ods: 'mdi-file-table',
    odp: 'mdi-file-presentation-box'
  };
  return iconMap[ext] || 'mdi-file';
};

const getFileTypeColor = (file) => {
  const ext = getFileExtension(file.name).toLowerCase();
  const colorMap = {
    pdf: '#f40f02',
    doc: '#2b579a',
    docx: '#2b579a',
    xls: '#107c41',
    xlsx: '#107c41',
    ppt: '#d04727',
    pptx: '#d04727',
    odt: '#0369a1',
    ods: '#0369a1',
    odp: '#0369a1'
  };
  return colorMap[ext] || '#666666';
};

// Función para generar ID único
const generateUniqueId = () => {
  return `file_${Date.now()}_${fileIdCounter.value++}`;
};

// Métodos de manejo de archivos
const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
};

const processFiles = (files) => {
  errorMessage.value = "";

  const validFiles = files
    .filter((file) => {
      // Validar tipo de archivo
      if (!currentFileTypes.value.includes(file.type)) {
        errorMessage.value = `Tipo de archivo no soportado: ${file.name}`;
        return false;
      }
      
      return true;
    })
    .map((file) => {
      // Crear un objeto wrapper con ID único y propiedades del File
      const fileWrapper = {
        id: generateUniqueId(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        originalFile: file, // Mantener referencia al archivo original
        preview: null
      };

      return fileWrapper;
    });

  selectedFiles.value = [...selectedFiles.value, ...validFiles];

  // Generar previews solo para imágenes
  generatePreviews(validFiles);

  emit("files-selected", selectedFiles.value.map(f => f.originalFile));
};

const generatePreviews = (files) => {
  files.forEach((fileWrapper) => {
    if (isImage(fileWrapper)) {
      const previewUrl = URL.createObjectURL(fileWrapper.originalFile);
      objectUrls.value.add(previewUrl); // Rastrear la URL
      
      // Actualizar el wrapper en el array reactivo
      const fileIndex = selectedFiles.value.findIndex((f) => f.id === fileWrapper.id);
      if (fileIndex !== -1) {
        selectedFiles.value[fileIndex].preview = previewUrl;
      }
    }
  });
};

const removeFile = (fileId) => {
  const fileIndex = selectedFiles.value.findIndex(f => f.id === fileId);
  if (fileIndex === -1) return;

  const file = selectedFiles.value[fileIndex];
  
  // Revocar la URL del objeto si existe
  if (file.preview && objectUrls.value.has(file.preview)) {
    URL.revokeObjectURL(file.preview);
    objectUrls.value.delete(file.preview);
  }
  
  // Eliminar del array
  selectedFiles.value.splice(fileIndex, 1);
  
  // Emitir la lista actualizada de archivos originales
  emit("files-selected", selectedFiles.value.map(f => f.originalFile));
};

const clearFiles = () => {
  // Revocar todas las URLs de objetos
  objectUrls.value.forEach(url => {
    URL.revokeObjectURL(url);
  });
  objectUrls.value.clear();
  
  selectedFiles.value = [];
  emit("files-selected", []);
};

const showError = (message) => {
  errorMessage.value = message;
};

const clearError = () => {
  errorMessage.value = "";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

defineExpose({
  clearFiles,
  showError,
  clearError,
  files: computed(() => selectedFiles.value.map(f => f.originalFile)),
});

onUnmounted(() => {
  // Limpiar todas las URLs de objetos al desmontar
  objectUrls.value.forEach(url => {
    URL.revokeObjectURL(url);
  });
  objectUrls.value.clear();
});
</script>

<style scoped>
.upload-area {
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafafa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #1976d2;
  background: #f5f5ff;
}

.upload-area.dragging {
  border-color: #1976d2;
  background: #e3f2fd;
  transform: scale(1.02);
}

.upload-area.has-files {
  border-style: solid;
  border-color: #1976d2;
  background: white;
  min-height: auto;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  color: #9e9e9e;
  margin-bottom: 1rem;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.browse-button {
  background: #1976d2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.browse-button:hover {
  background: #1565c0;
}

.browse-button.secondary {
  background: #f5f5f5;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.browse-button.secondary:hover {
  background: #e3f2fd;
}

.upload-info {
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
}

.files-preview {
  width: 100%;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.file-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  background: white;
  transition: transform 0.2s ease;
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.file-preview {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.25rem;
}

.file-extension {
  font-size: 0.75rem;
  font-weight: bold;
  color: #666;
}

.file-info {
  text-align: left;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.file-size {
  font-size: 0.75rem;
  color: #666;
  margin: 0.25rem 0 0 0;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-button:hover {
  background: #f44336;
}

.upload-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .upload-area {
    padding: 1rem;
  }

  .upload-title {
    font-size: 1.25rem;
  }

  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .upload-actions {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>