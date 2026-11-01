<template>
  <span class="app-brand" :class="{ 'app-brand--light': light, 'app-brand--compact': compact }">
    <img src="/brand/symbol.svg" alt="" width="46" height="46" class="app-brand__symbol" />
    <span class="app-brand__name">{{ BRAND.name }}<small>{{ BRAND.tagline }}</small></span>
  </span>
</template>
<script setup>
import { BRAND } from '@/config/brand';
defineProps({ light: Boolean, compact: Boolean });
</script>
<style scoped>
.app-brand{display:inline-flex;align-items:center;gap:12px;vertical-align:middle;color:#234e3d;white-space:nowrap}.app-brand__symbol{width:46px;height:46px;flex-shrink:0;border-radius:13px}.app-brand__name{font-family:Georgia,'Times New Roman',serif!important;font-size:27px;font-weight:600;letter-spacing:-.7px;line-height:1.1}.app-brand__name small{display:block;font-family:Arial,sans-serif!important;font-size:7px;font-weight:500;letter-spacing:2.2px;line-height:1.3;margin-top:7px;color:#7c896b}.app-brand--light{color:#f7f3e5}.app-brand--light .app-brand__symbol{border:1px solid #738770}.app-brand--light small{color:#bdc7ad}.app-brand--compact .app-brand__symbol{width:35px;height:35px;border-radius:10px}.app-brand--compact .app-brand__name{font-size:22px}.app-brand--compact small{font-size:6px;letter-spacing:1.6px;margin-top:5px}@media(max-width:640px){.app-brand{gap:9px}.app-brand__symbol{width:36px;height:36px;border-radius:10px}.app-brand__name{font-size:22px}.app-brand__name small{font-size:6px;letter-spacing:1.7px;margin-top:6px}}
</style>
