<script lang="ts" setup>
const signIn = () => navigateTo(`/auth/sign-in/oidc.line`, { external: true })
</script>

<template>
    <v-btn variant="flat" size="large" color="#4CAF50" @click="signIn">
        使用 LINE 登入
    </v-btn>
</template>

<style scoped></style>