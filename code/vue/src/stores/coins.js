import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'

export const useCoinsStore = defineStore('coins', () => {

  const gameCoins = ref();
  const { toast } = useToast();
  const router = useRouter();

  const getCoins = async () => {
    try {
      const response = await axios.get('users/me/coins');
      gameCoins.value = response.data.coins;
    } catch (error) {
      console.error('Error in Getting Coins:', error);
    }
  };

  const purchaseCoins = async (type, reference, coinValue , euros) => {
    try {
      const payload = { type, reference, value : euros };
      const paymentResponse = await axios.post('https://dad-202425-payments-api.vercel.app/api/debit', payload);

      if (paymentResponse.status === 201) {

        const backendPayload = { type, reference, coinValue, euros };
        const response = await axios.post('users/me/coins/purchase', backendPayload);

        if (response.status === 200) {
          gameCoins.value += backendPayload.coinValue;

          router.push('/dashboard');

          setTimeout(() => {
            toast({
              description: 'Coins purchased successfully!',
              className: 'toast-success',
            });
          }, 1000);

        } else {
          throw new Error('Payment validation failed. Please check your details.');
        }
      }
    } catch (error) {
      console.error('Error on Buying Coins:', error);
    }
  };

  const spendCoins = async (value) => {

    if (gameCoins.value >= value) {

      const response = await axios.post('users/me/coins/spend', {value} );
      getCoins();

    } else {
      throw new Error('Insufficient coins.');
    }
    
  };
  

  return {
    gameCoins,
    getCoins,
    purchaseCoins,
    spendCoins
  }
});
