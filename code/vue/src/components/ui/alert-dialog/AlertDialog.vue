<script setup>
import { AlertDialogRoot, useForwardPropsEmits } from 'radix-vue';

const props = defineProps({
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
});
const emits = defineEmits(['update:open']);

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <AlertDialogRoot v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>

<style scoped>
/* Estilize o contêiner do popup */
.alert-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Fundo escuro com opacidade */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Caixa do diálogo */
.alert-dialog-content {
  background: rgb(30, 30, 30); /* Fundo escuro */
  color: rgb(200, 200, 200); /* Texto claro */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Sombra */
  max-width: 400px;
  width: 90%;
  text-align: center;
}

/* Cabeçalho do diálogo */
.alert-dialog-header {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

/* Corpo do diálogo */
.alert-dialog-body {
  font-size: 1rem;
  margin-bottom: 20px;
}

/* Rodapé com botões */
.alert-dialog-footer {
  display: flex;
  justify-content: space-between;
}

/* Botões */
.alert-dialog-cancel,
.alert-dialog-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
}

.alert-dialog-cancel {
  background: rgb(80, 80, 80); /* Cinza para "Cancelar" */
  color: rgb(200, 200, 200); /* Texto claro */
}

.alert-dialog-cancel:hover {
  background: rgb(100, 100, 100); /* Cinza mais claro */
}

.alert-dialog-confirm {
  background: linear-gradient(145deg, rgb(30, 144, 255), rgb(0, 123, 255)); /* Azul gradiente */
  color: white; /* Texto branco */
}

.alert-dialog-confirm:hover {
  background: linear-gradient(145deg, rgb(0, 123, 255), rgb(30, 144, 255)); /* Gradiente invertido */
}
</style>