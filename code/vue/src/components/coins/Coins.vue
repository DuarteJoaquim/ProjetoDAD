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
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  margin-top: 5%;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.buy-button {
  width: 100%;
  padding: 10px;
  background-color: #31485A;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.buy-button:hover {
  background-color: #253544;
}

p.success {
  color: green;
  text-align: center;
  margin-top: 10px;
}

p.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

@media (max-width: 768px) {

  .coins-container {
    margin-top: 20%;
  }

}
</style>