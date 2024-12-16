<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { useAuthStore } from '@/stores/auth'

  const storeAuth = useAuthStore()

  const newCredentials = computed(() => ({
    name: storeAuth.user.name,
    email: storeAuth.user.email,
    nickname: storeAuth.user.nickname,
    password: '',
    confirmPassword: ''
  }))

  const updateProfile = () => {
      storeAuth.updateProfile(newCredentials.value)
  }

</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Update profile</CardTitle>
      <CardDescription>Enter your new credentials to update.</CardDescription>
      <CardDescription  v-if="storeAuth.success" class="text-success"> User updated successfully </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">name</Label>
            <!-- Input com o valar default -->
            <Input id="name" type="name" placeholder="Name" v-model="newCredentials.name"/>
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.name" :errorMessage="storeAuth.errorsUpdateProfile.name" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="Email"  v-model="newCredentials.email"/>
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.email" :errorMessage="storeAuth.errorsUpdateProfile.email" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input id="nickname" type="name" placeholder="Nickname"  v-model="newCredentials.nickname"/>
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.nickname" :errorMessage="storeAuth.errorsUpdateProfile.nickname" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" v-model="newCredentials.password"/>
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.password" :errorMessage="storeAuth.errorsUpdateProfile.password" > </ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Confirm password</Label>
            <Input id="confirmpassword" type="password" placeholder="Confirm password" v-model="newCredentials.confirmPassword"/>
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.confirmPassword" :errorMessage="storeAuth.errorsUpdateProfile.confirmPassword" > </ErrorMessage>
          </div>
        </div>
      </form>  
    </CardContent>
    <CardFooter class="flex justify-end px-6 pb-6">
        <Button @click="updateProfile">
            Update profile
        </Button>
      </CardFooter>
  </Card>
</template>

<style scoped>
  .text-success {
    color: green;
    font-weight: bold;
  }
</style>
