<template>
  <v-app class="market-app">
    <v-app-bar flat color="#164c3d"><v-app-bar-title>{{ BRAND.name }} · Mi negocio</v-app-bar-title><v-btn to="/">Ver catálogo</v-btn><v-btn to="/dashboard">Mi cuenta</v-btn></v-app-bar>
    <v-main><v-container style="max-width:1200px" class="py-8">
      <p class="text-overline text-teal-darken-3">ADMINISTRACIÓN DEL PUESTO</p>
      <h1 class="text-h4 mb-2">Tu negocio, al día</h1><p class="mb-6">Administra tus productos y registra cada entrada o salida de inventario.</p>
      <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">{{ error }}</v-alert>
      <v-alert v-if="success" type="success" class="mb-4" closable @click:close="success = ''">{{ success }}</v-alert>
      <v-progress-linear v-if="loading" indeterminate color="teal" class="mb-4" />
      <div class="d-flex flex-wrap ga-3 align-center mb-6">
        <v-select v-model="commerceId" :items="commerces" item-title="name" item-value="id" label="Mi comercio" hide-details style="max-width:400px" :disabled="loading || saving" @update:model-value="loadProducts" />
        <v-btn variant="outlined" :disabled="saving" @click="commerceDialog = true">Registrar comercio</v-btn>
        <v-btn color="teal-darken-3" :disabled="!commerceId || loading || saving" @click="openProduct()">Agregar producto</v-btn>
      </div>
      <v-alert v-if="!loading && !commerces.length" type="info" variant="tonal">Registra tu comercio para comenzar. Cada cuenta administra sus propios puestos.</v-alert>
      <v-row v-if="commerceId" class="mb-4">
        <v-col cols="12" sm="4"><v-card rounded="lg" variant="tonal" color="teal"><v-card-text><div>Productos</div><strong class="text-h4">{{ products.length }}</strong></v-card-text></v-card></v-col>
        <v-col cols="12" sm="4"><v-card rounded="lg" variant="tonal" color="teal"><v-card-text><div>Publicados en el catálogo</div><strong class="text-h4">{{ products.filter(p => p.active).length }}</strong></v-card-text></v-card></v-col>
        <v-col cols="12" sm="4"><v-card rounded="lg" variant="tonal" color="orange"><v-card-text><div>Sin existencias</div><strong class="text-h4">{{ products.filter(p => Number(p.stock) === 0).length }}</strong></v-card-text></v-card></v-col>
      </v-row>
      <v-text-field v-if="commerceId" v-model="search" label="Buscar en mis productos" prepend-inner-icon="mdi-magnify" variant="outlined" clearable />
      <v-table v-if="commerceId" class="table-sin-estilizar rounded-lg"><thead><tr><th>Producto</th><th>Precio</th><th>Existencias</th><th>Catálogo</th><th>Acciones</th></tr></thead><tbody>
        <tr v-for="p in filtered" :key="p.id"><td><strong>{{ p.name }}</strong><div class="text-caption">{{ p.category }}</div></td><td>{{ money(p.price) }} / {{ p.unit }}</td><td>{{ Number(p.stock) }} {{ p.unit }}</td><td>{{ p.active ? 'Publicado' : 'Oculto' }}</td><td class="text-no-wrap"><v-btn size="small" variant="text" :disabled="saving" @click="openProduct(p)">Editar</v-btn><v-btn size="small" variant="text" :disabled="saving" @click="openMovement(p)">Inventario</v-btn><v-btn size="small" variant="text" :disabled="saving" @click="showHistory(p)">Historial</v-btn></td></tr>
        <tr v-if="!filtered.length"><td colspan="5" class="pa-6 text-center">{{ products.length ? 'No hay coincidencias.' : 'Todavía no tienes productos registrados.' }}</td></tr>
      </tbody></v-table>
      <v-dialog v-model="commerceDialog" max-width="520" :persistent="saving"><v-card title="Registrar mi comercio"><v-card-text><v-form id="commerce-form" @submit.prevent="saveCommerce">
        <v-text-field v-model="commerce.name" label="Nombre del negocio" required maxlength="180" /><v-text-field v-model="commerce.market" label="Mercado" required maxlength="180" /><v-text-field v-model="commerce.stall" label="Número o ubicación del puesto" required maxlength="180" /><v-text-field v-model="commerce.phone" label="Teléfono de contacto" required maxlength="30" />
      </v-form></v-card-text><v-card-actions><v-btn :disabled="saving" @click="commerceDialog = false">Cancelar</v-btn><v-btn type="submit" form="commerce-form" color="teal" :loading="saving">Guardar comercio</v-btn></v-card-actions></v-card></v-dialog>
      <v-dialog v-model="productDialog" max-width="560" :persistent="saving"><v-card :title="product.id ? 'Editar producto' : 'Nuevo producto'"><v-card-text><v-form id="product-form" @submit.prevent="saveProduct">
        <v-text-field v-model="product.name" label="Nombre" required maxlength="180" /><v-text-field v-model="product.category" label="Categoría" required maxlength="80" /><v-text-field v-model="product.unit" label="Unidad de venta (libra, unidad, docena…)" required maxlength="30" />
        <v-text-field v-model.number="product.price" label="Precio en dólares" type="number" min="0" max="9999999.99" step="0.01" required /><v-text-field v-if="!product.id" v-model.number="product.stock" label="Existencias iniciales" type="number" min="0" max="999999999" step="0.001" required />
        <v-text-field v-model="product.image_url" label="URL de imagen HTTPS (opcional)" type="url" maxlength="2000" /><v-switch v-if="product.id" v-model="product.active" label="Visible en el catálogo" color="teal" /><p v-if="product.id" class="text-caption">Para cambiar existencias, registra un movimiento en Inventario.</p>
      </v-form></v-card-text><v-card-actions><v-btn :disabled="saving" @click="productDialog = false">Cancelar</v-btn><v-btn type="submit" form="product-form" color="teal" :loading="saving">Guardar producto</v-btn></v-card-actions></v-card></v-dialog>
      <v-dialog v-model="movementDialog" max-width="500" :persistent="saving"><v-card :title="`Inventario · ${selected?.name || ''}`"><v-card-text><p class="mb-4">Disponible: {{ Number(selected?.stock) }} {{ selected?.unit }}</p><v-form id="movement-form" @submit.prevent="saveMovement"><v-select v-model="direction" :items="[{title:'Entrada de mercancía',value:1},{title:'Salida / venta presencial',value:-1}]" label="Tipo de movimiento" /><v-text-field v-model.number="movement.amount" label="Cantidad" type="number" min="0.001" max="999999999" step="0.001" required /><v-text-field v-model="movement.reason" label="Motivo" required maxlength="180" /></v-form></v-card-text><v-card-actions><v-btn :disabled="saving" @click="movementDialog = false">Cancelar</v-btn><v-btn type="submit" form="movement-form" color="teal" :loading="saving">Registrar</v-btn></v-card-actions></v-card></v-dialog>
      <v-dialog v-model="historyDialog" max-width="700"><v-card title="Historial de inventario"><v-card-text><p class="mb-3">{{ selected?.name }} · Últimos 100 movimientos</p><v-table class="table-sin-estilizar"><thead><tr><th>Fecha</th><th>Motivo</th><th>Movimiento</th><th>Saldo</th></tr></thead><tbody><tr v-for="m in history" :key="m.id"><td>{{ new Date(m.createdAt || m.created_at).toLocaleString('es-SV') }}</td><td>{{ m.reason }}</td><td>{{ Number(m.delta) }}</td><td>{{ Number(m.balance) }}</td></tr></tbody></v-table></v-card-text><v-card-actions><v-btn @click="historyDialog = false">Cerrar</v-btn></v-card-actions></v-card></v-dialog>
    </v-container></v-main>
    <v-snackbar v-model="dialogError" color="error" :timeout="8000">{{ error }}</v-snackbar>
  </v-app>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/mercado.services';
import { BRAND } from '@/config/brand';
const commerces = ref([]), products = ref([]), commerceId = ref(null), loading = ref(false), saving = ref(false), error = ref(''), success = ref(''), search = ref(''), dialogError = ref(false);
const commerceDialog = ref(false), productDialog = ref(false), movementDialog = ref(false), historyDialog = ref(false);
const commerce = ref({ name: '', market: 'San Miguelito', stall: '', phone: '' });
const product = ref({}), selected = ref(null), movement = ref({}), direction = ref(1), history = ref([]);
const money = value => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(Number(value));
const filtered = computed(() => products.value.filter(p => `${p.name} ${p.category}`.toLowerCase().includes((search.value || '').toLowerCase())));
function report(e) { error.value = e.response?.data?.message || e.response?.data?.mensaje || e.response?.data?.description || (e.response?.status === 401 ? 'Tu sesión terminó. Ingresa de nuevo desde Mi cuenta.' : 'No se pudo completar la operación. Comprueba la conexión con el servidor.'); dialogError.value = true; }
let request = 0;
async function loadProducts() {
  const current = ++request; products.value = []; if (!commerceId.value) return;
  loading.value = true; error.value = '';
  try { const { data } = await api.products(commerceId.value); if (current === request) products.value = data; } catch(e) { if (current === request) report(e); } finally { if (current === request) loading.value = false; }
}
async function saveCommerce() {
  if (saving.value) return; saving.value = true; error.value = '';
  try { const {data} = await api.createCommerce(commerce.value); commerces.value.push(data); commerceId.value = data.id; commerceDialog.value = false; commerce.value = {name:'', market:'San Miguelito', stall:'', phone:''}; success.value = 'Comercio registrado.'; await loadProducts(); } catch(e) { report(e); } finally { saving.value = false; }
}
function openProduct(p) { product.value = p ? {...p, price:Number(p.price)} : {name:'', category:'', unit:'unidad', price:0, stock:0, image_url:'', active:true}; productDialog.value = true; }
async function saveProduct() {
  if (saving.value) return; saving.value = true; error.value = '';
  try { if (product.value.id) await api.updateProduct(commerceId.value, product.value.id, product.value); else await api.createProduct(commerceId.value, product.value); productDialog.value = false; success.value = 'Producto guardado.'; await loadProducts(); } catch(e) { report(e); } finally { saving.value = false; }
}
function openMovement(p) { selected.value = p; movement.value = {amount:1, reason:''}; direction.value = 1; movementDialog.value = true; }
async function saveMovement() {
  if (saving.value) return; saving.value = true; error.value = '';
  try { await api.move(commerceId.value, selected.value.id, {delta:movement.value.amount * direction.value, reason:movement.value.reason}); movementDialog.value = false; success.value = 'Movimiento registrado.'; await loadProducts(); } catch(e) { report(e); } finally { saving.value = false; }
}
async function showHistory(p) { try { const {data} = await api.history(commerceId.value,p.id); selected.value=p; history.value=data; historyDialog.value=true; } catch(e) { report(e); } }
onMounted(async () => { loading.value=true; try { commerces.value=(await api.commerces()).data; commerceId.value=commerces.value[0]?.id || null; await loadProducts(); } catch(e) { report(e); } finally { loading.value=false; } });
</script>
<style scoped>.market-app { background:#f5f7f3; color:#183d32; }</style>
