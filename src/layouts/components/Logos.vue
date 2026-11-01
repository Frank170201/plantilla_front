<template>
    <router-link to="/">
        <div class="d-flex align-center" style="gap: 24px; height: 85px;">
            <img :src="logo" alt="Kiosko" style="max-height: 100%; max-width: 260px;" />
            <v-divider vertical />

        </div>
    </router-link>
</template>
<script setup>
const logo = '/brand/logo.svg';

</script>
