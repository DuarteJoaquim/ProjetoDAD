import './assets/main.css'
import '@/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import { io } from 'socket.io-client'

import App from './App.vue'
import router from './router'

import ErrorMessage from './components/common/ErrorMessage.vue'

const app = createApp(App)

// Uso do Pinia e Router
app.use(createPinia())
app.use(router)

// Configuração do domínio da API e conexão WebSocket
const apiDomain = import.meta.env.VITE_API_DOMAIN
const wsConnection = import.meta.env.VITE_WS_CONNECTION

console.log('API Domain:', apiDomain)
console.log('WebSocket Connection:', wsConnection)

// Configuração padrão do Axios
axios.defaults.baseURL = `http://${apiDomain}/api`

// Configuração do WebSocket como global
const socket = io(wsConnection)
app.provide('socket', socket)

// Fornecer o baseUrl para outros componentes
app.provide('serverBaseUrl', apiDomain)

// Registro de componentes globais
app.component('ErrorMessage', ErrorMessage)

// Montagem da aplicação
app.mount('#app')
