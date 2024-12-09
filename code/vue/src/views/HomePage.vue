<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 class="text-4xl font-bold mb-8">Memory Game</h1>
      <div class="space-y-4">
        <!-- Botão de Login -->
        <RouterLink to="/login" class="block text-center bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded shadow transition">
          Login
        </RouterLink>
        
        <!-- Botão de Registro -->
        <RouterLink to="/register" class="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded shadow transition">
          Register
        </RouterLink>
        
        <!-- Botão para Jogar Anônimo -->
        <RouterLink to="/play-anonymous" class="block text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition">
          Play As Anonymous
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  </style>
  