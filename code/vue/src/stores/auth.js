import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "@/stores/error";
import { useCoinsStore } from "@/stores/coins";
import { useRouter } from "vue-router";
import avatarNoneAssetURL from "@/assets/avatar-none.png";
import { useToast } from '@/components/ui/toast/use-toast'

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const storeError = useErrorStore();
  const storeCoins = useCoinsStore();
  const { toast } = useToast();

  const user = ref(null);
  const token = ref("");

  const errorsRegister = ref([]);
  const errorsUpdateProfile = ref([]);
  const success = ref(false);
  
  const userName = computed(() => {
    return user.value ? user.value.name : "";
  });
  
  const userEmail = computed(() => {
    return user.value ? user.value.email : "";
  });

  const userNickname = computed(() => {
    return user.value ? user.value.nickname : "";
  });
  
  const userType = computed(() => {
    return user.value ? user.value.type : "";
  });

  const userPhotoUrl = computed(() => {
    const photoFile = user.value ? user.value.photoFileName ?? "" : "";
    if (photoFile) {
      return axios.defaults.baseURL.replaceAll("/api", photoFile);
    }
    return avatarNoneAssetURL;
  });

  // This function is "private" - not exported by the store
  const clearUser = () => {
    resetIntervalToRefreshToken();
    user.value = null;
    axios.defaults.headers.common.Authorization = "";
    localStorage.removeItem("token");
  };

  const login = async (credentials) => {
    storeError.resetMessages();
    try {
      const responseLogin = await axios.post("auth/login", credentials);
      token.value = responseLogin.data.token;
      axios.defaults.headers.common.Authorization = "Bearer " + token.value;
      localStorage.setItem("token", token.value);
      const responseUser = await axios.get("users/me");
      user.value = responseUser.data.data;
      repeatRefreshToken();
      storeCoins.getCoins();
      router.push({ name: "dashboard" });

      setTimeout(() => {
        toast({
          description: 'Login successful!',
          className: 'toast-success',
        });
      }, 1000);

      return user.value;
    } catch (e) {
      clearUser();
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        "Authentication Error!"
      );
      return false;
    }
  };

  const register = async (credentials) => {
    storeError.resetMessages(); // Reseta mensagens de erro antes de iniciar
    try {
      await axios.post("auth/register", credentials);
  
      return loginResponse = await login({
        email: credentials.email,
        password: credentials.password,
      });

    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        "Registration Error!"
      );
      if (e.response?.data.errors != null) {
        errorsRegister.value = e.response.data.errors;
      }
      return false;
    }
  };

  const updateProfile = async (credentials) => {
    storeError.resetMessages(); // Reseta mensagens de erro antes de iniciar
    try {
      errorsUpdateProfile.value = [];
      success.value = false;
      const responseUser = await axios.put("auth/updateProfile", credentials);
      user.value = null;
      user.value = responseUser.data.data;
      success.value = true;
    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        "Registration Error!"
      );
      if (e.response?.data.errors != null) {
        errorsUpdateProfile.value = e.response.data.errors;
      }
      return false;
    }
  };

  const logout = async () => {
    storeError.resetMessages();
    try {
      router.push({ name: 'dashboard' })
      await axios.post("auth/logout");
      clearUser();
      return true;
    } catch (e) {
      clearUser();
      storeError.setErrorMessages(
        e.response.data.message,
        [],
        e.response.status,
        "Authentication Error!"
      );
      return false;
    }
  };

  // These 2 functions and intervalToRefreshToken variable are "private" - not exported
  let intervalToRefreshToken = null;
  const resetIntervalToRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken);
    }
    intervalToRefreshToken = null;
  };

  const repeatRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken);
    }
    intervalToRefreshToken = setInterval(async () => {
      try {
        const response = await axios.post("auth/refreshtoken");
        token.value = response.data.token;
        axios.defaults.headers.common.Authorization = "Bearer " + token.value;
        localStorage.setItem("token", token.value);
        return true;
      } catch (e) {
        clearUser();
        storeError.setErrorMessages(
          e.response.data.message,
          e.response.data.errors,
          e.response.status,
          "Authentication Error!"
        );
        return false;
      }
    }, 1000 * 60 * 110); // repeat every 110 minutes
    // To test the refresh token, replace previous line with the following code
    // This will repeat the refreshtoken endpoint every 10 seconds:
    //}, 1000 * 10)
    return intervalToRefreshToken;
  };


  const restoreToken = async function () {
    let storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        token.value = storedToken;
        axios.defaults.headers.common.Authorization = "Bearer " + token.value;
        const responseUser = await axios.get("users/me");
        storeCoins.getCoins();
        user.value = responseUser.data.data;
        repeatRefreshToken();
        return true;
      } catch {
        clearUser();
        return false;
      }
    }
    return false;
  };

  const registerAdmin = async (credentials) => {
    storeError.resetMessages();
    try {
      const response = await axios.post("auth/register-admin", credentials);
      return response.data;
    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        "Admin Registration Error!"
      );
      throw e;
    }
  };

  return {
    user,
    userName,
    userEmail,
    userNickname,
    userType,
    userPhotoUrl,
    errorsRegister,
    errorsUpdateProfile,
    success,
    register,
    login,
    logout,
    restoreToken,
    updateProfile,
    registerAdmin,
  };
});
