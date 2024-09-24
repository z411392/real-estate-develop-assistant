<script lang="ts" setup>
import { Pages } from "~/lib/constants"
import { withEnsuringUserSignedOut } from "~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedOut"
import Snackbar from '~/components/utils/Snackbar.vue'
import LINESignInButton from "~/components/auth/sign-in/LINESignInButton.vue"
import Center from '~/components/utils/Center.vue'
import { useSnackbar } from "~/composables/utils/useSnackbar"

definePageMeta({
    name: Pages.SignIn.name,
    middleware: [
        withEnsuringUserSignedOut,
    ],
})

const snackbar = useSnackbar()
</script>

<template>
    <v-app>
        <Snackbar ref="snackbar" />
        <Center>
            <LINESignInButton />
        </Center>
    </v-app>
</template>