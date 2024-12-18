<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const storeAuth = useAuthStore()

  const credentials = ref({
      name: '',
      email: '',
      password: '',
      nickname: '',
  })

  const register = () => {
      storeAuth.register(credentials.value)
  }

  const goToDashboard = () => {
    router.push({ name: 'dashboard' });
  };

  const goToLogin = () => {
    router.push({ name: 'login' });
  };
</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Register</CardTitle>
      <CardDescription>Enter your credentials to access your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">name</Label>
            <Input id="name" type="name" placeholder="User name"  v-model="credentials.name"/>
            <ErrorMessage v-if="storeAuth.errorsRegister.name" :errorMessage="storeAuth.errorsRegister.name" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email"  v-model="credentials.email"/>
            <ErrorMessage v-if="storeAuth.errorsRegister.email" :errorMessage="storeAuth.errorsRegister.email" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input id="nickname" type="name" placeholder="User nickname"  v-model="credentials.nickname"/>
            <ErrorMessage v-if="storeAuth.errorsRegister.nickname" :errorMessage="storeAuth.errorsRegister.nickname" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="credentials.password"/>
            <ErrorMessage v-if="storeAuth.errorsRegister.password" :errorMessage="storeAuth.errorsRegister.password" > </ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="goToDashboard">
            Dashboard
        </Button>
        <Button @click="goToLogin">
            Login
        </Button>
        <Button @click="register">
            Register
        </Button>
    </CardFooter>
  </Card>
</template>