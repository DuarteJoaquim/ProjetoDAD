<script setup>
import Header from './components/Header.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
</script>

<template>
  <Header />
  <Toaster />
  <main>
    <div id="app">
      <router-view />
    </div>
  </main>
</template>

<style scoped>
#app {
  background-color: white;
  min-height: 100vh;
}
</style>



