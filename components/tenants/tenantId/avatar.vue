<script lang="ts" setup>
import { getAuth } from 'firebase/auth'
const auth = getAuth()
const user = auth.currentUser!
</script>

<template>
    <v-avatar>
        <template v-if="user.photoURL">
            <v-img :src="user.photoURL">
                <template #error>
                    <span class="text-h5">{{ user.uid }}</span>
                </template>
            </v-img>
        </template>
        <template v-else>
            <span class="text-h5">{{ user.uid }}</span>
        </template>
    </v-avatar>
</template>