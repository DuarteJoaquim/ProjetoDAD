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
      email: '',
      password: ''
  })

  const login = () => {
    storeAuth.login(credentials.value)
  }

  const goToDashboard = () => {
    router.push({ name: 'dashboard' });
  };

  const goToRegister = () => {
    router.push({ name: 'register' });
  };
  
</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your credentials to access your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email"  v-model="credentials.email"/>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="credentials.password"/>
            <ErrorMessage errorMessage=""></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="goToDashboard">
            Dashboard
        </Button>
        <Button @click="goToRegister">
            Register
        </Button>
        <Button @click="login">
            Login
        </Button>
    </CardFooter>
  </Card>
</template>