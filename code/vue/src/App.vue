<script setup>
import Toaster from './components/ui/toast/Toaster.vue';

</script>

<template>
  <Toaster />
  <div class="min-h-screen bg-gray-50">
        <RouterView />
  </div>
</template>