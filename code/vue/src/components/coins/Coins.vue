<template>
  <div class="coins-container">
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
</template>

<script setup>
import { ref } from 'vue';
import { useCoinsStore } from '@/stores/coins';

const storeCoins = useCoinsStore();

const paymentType = ref('');
const reference = ref('');
const coinValue = ref(10);
const message = ref('');
const isSuccess = ref(false);

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
    await storeCoins.purchaseCoins(paymentType.value, reference.value, coinValue.value);

    message.value = 'Coins purchased successfully!';
    isSuccess.value = true;

  } catch (error) {
    message.value = error.message || 'An error occurred while purchasing coins.';
    isSuccess.value = false;
  }
};

</script>

<style scoped>

.coins-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 25px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 700; /* Aumentar o peso da fonte */
  color: #2C3E50; /* Cor escura para maior contraste */
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600; /* Fonte mais legível */
  color: #34495E; /* Cor escura */
}

input,
select {
  width: 100%;
  padding: 12px; /* Mais altura para inputs */
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #2C3E50; /* Texto escuro */
  background-color: #ffffff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

input[disabled],
select[disabled] {
  background-color: #f3f3f3;
  color: #b0b0b0; /* Contraste maior em estados desativados */
  cursor: not-allowed;
}

.buy-button {
  width: 100%;
  padding: 12px;
  background-color: #3498db; /* Azul vibrante */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700; /* Texto em negrito */
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.buy-button:hover {
  background-color: #2980b9; /* Tom mais escuro no hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

p.success {
  color: #2ecc71;
  text-align: center;
  margin-top: 15px;
  font-size: 1rem;
  font-weight: 600;
}

p.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  font-size: 1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .coins-container {
    margin-top: 10%;
    padding: 20px;
  }

  h1 {
    font-size: 1.5rem;
  }

  input,
  select,
  .buy-button {
    font-size: 0.95rem;
  }
}


</style>