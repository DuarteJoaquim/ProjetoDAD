<template>
  <div class="container">
  <div class="coins-container">
    <button class="back-button" @click="goBack">Back</button>
    <h1>Buy Brain Coins</h1>

    <form @submit.prevent="buyCoins">
      <div class="form-group">
        <label for="paymentType">Payment Type</label>
        <select v-model="paymentType" id="paymentType" required>
          <option value="" disabled>Select a payment method</option>
          <option value="MBWAY">MB WAY</option>
          <option value="PAYPAL">PayPal</option>
          <option value="IBAN">IBAN</option>
          <option value="MB">MB</option>
          <option value="VISA">Visa</option>
        </select>
      </div>

      <div class="form-group">
        <label for="reference">Payment Reference</label>
        <input v-model="reference" type="text" id="reference" placeholder="Enter payment reference" required />
      </div>

      <div class="amount-to-pay">
        <p>You will pay: <strong>{{ eurosToPay.toFixed(2) }} €</strong></p>
      </div>

      <div class="form-group">
        <label for="coinValue">Number of Coins (multiples of 10)</label>
        <input v-model.number="coinValue" type="number" id="coinValue" min="10" step="10" placeholder="Enter amount"
          required />
      </div>

      <button type="submit" class="buy-button">Buy Coins</button>
    </form>

    <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
      {{ message }}
    </p>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useCoinsStore } from '@/stores/coins';
import { computed } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter();

const storeCoins = useCoinsStore();

const paymentType = ref('');
const reference = ref('');
const coinValue = ref(10);
const message = ref('');
const isSuccess = ref(false);

// Computed para calcular o valor em euros automaticamente
const eurosToPay = computed(() => coinValue.value / 10); // 10 coins = 1 €

const validatePaymentReference = (type, reference) => {
  const regexes = {
    MBWAY: /^9\d{8}$/,
    PAYPAL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    IBAN: /^[A-Z]{2}\d{23}$/,
    MB: /^\d{5}-\d{9}$/,
    VISA: /^4\d{15}$/,
  };
  return regexes[type]?.test(reference) || false;
};


const buyCoins = async () => {
  if (!validatePaymentReference(paymentType.value, reference.value)) {
    message.value = 'Invalid payment reference for the selected method.';
    isSuccess.value = false;
    return;
  }

  if (coinValue.value <= 0 || coinValue.value % 10 !== 0) {
    message.value = 'Coin value must be a positive multiple of 10.';
    isSuccess.value = false;
    return;
  }

  try {
    
    // Faz a chamada para comprar moedas
    const response = await storeCoins.purchaseCoins(
      paymentType.value, 
      reference.value, 
      coinValue.value, 
      eurosToPay.value
    );

    storeCoins.gameCoins += coinValue.value; // Atualiza o número de moedas
    storeCoins.getCoins(); // Atualiza a lista de moedas

    message.value = 'Coins purchased successfully!';
    isSuccess.value = true;

  } catch (error) {
    message.value = error.message || 'An error occurred while purchasing coins.';
    isSuccess.value = false;
  }
};

// Função para voltar para a página anterior
const goBack = () => {
    router.back(); // Usa o histórico do navegador para voltar
  };


</script>

<style scoped>

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  background: rgba(0, 0, 0, 0.918);
}

.coins-container {
  width: 400px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgba(48, 29, 143, 0.048);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#paymentType{
  width: 100%;
  padding: 10px;
  border: 1px solid rgb(200, 200, 200); /* Cor da borda */
  border-radius: 6px;
  background: rgba(245, 245, 245, 0.904); /* Cor de fundo */
  color: rgb(50, 50, 50); /* Cor do texto */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra interna */
  transition: border-color 0.2s ease-in-out;
}

.form-container {
    background-color: #121212 !important;
    color: var(--foreground);
    padding: 20px;
    text-align: center;
  }

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--primary); /* Cor primária */
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  color: var(--foreground);
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgb(200, 200, 200); /* Cor da borda */
  border-radius: 6px;
  background: rgba(245, 245, 245, 0.904); /* Cor de fundo */
  color: rgb(50, 50, 50); /* Cor do texto */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra interna */
  transition: border-color 0.2s ease-in-out;
}

input:focus {
  border-color: rgb(0, 123, 255); /* Cor da borda ao focar */
  outline: none;
}

button {
  padding: 10px 20px;
  background: linear-gradient(145deg, #5763D6, #3944BC);
  color: rgba(255, 255, 255, 0.822);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: block;
  width: 100%;
}

button:hover {
  background: linear-gradient(145deg, #3944BC, #5763D6);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.errors {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}


.back-button {
  margin-left: 38%;
  display: inline-block;
  width: 20%;
  padding: 5px 10px;
  margin-bottom: 4%;
  background: linear-gradient(145deg, #2b0606, #e74c3c);
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background: linear-gradient(145deg, #c0392b, #e74c3c);
  transform: translateY(-2px);
}
</style>