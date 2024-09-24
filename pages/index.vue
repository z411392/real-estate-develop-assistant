<script lang="ts" setup>
import { Pages } from "~/lib/constants"
import { withEnsuringUserSignedIn } from "~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedIn"
import Snackbar from '~/components/utils/Snackbar.vue'
import { type Tenant } from "~/lib/modules/TenantManaging/dtos/Tenant"
import { onListingTenants } from "~/lib/modules/TenantManaging/presentation/controllers/onListingTenants"
import { onCountingTenants } from "~/lib/modules/TenantManaging/presentation/controllers/onCountingTenants"
import { useSnackbar } from "~/composables/utils/useSnackbar"

definePageMeta({
    name: Pages.Tenants.name,
    middleware: [
        withEnsuringUserSignedIn,
    ],
})

const snackbar = useSnackbar()

const page = ref(1)
const total = ref(0)
const tenants = ref([] as Tenant[])
onBeforeMount(async () => {
    total.value = await onCountingTenants()
    if (!total.value) return
    tenants.value = await onListingTenants(page.value)
})
</script>

<template>
    <Snackbar ref="snackbar" />
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <v-sheet color="primary" :class="$style['banner']">
                        <h2>地政小幫手</h2>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-spacer />
            <v-row>
                <v-col>
                    <v-sheet :class="$style['tenants']">
                        <h3>選擇團隊</h3>
                        <v-container>
                            <template v-for="{ id: tenantId, name } of tenants">
                                <v-row>
                                    <v-col>
                                        <a :href="`/tenants/${tenantId}`">
                                            <v-card variant="plain">
                                                <v-card-title>
                                                    {{ name }}
                                                </v-card-title>
                                            </v-card>
                                        </a>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-container>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<style scoped>
h2 {
    @apply text-3xl font-black text-center;
}

h3 {
    @apply text-2xl font-black;
}
</style>

<style scoped module>
.banner {
    color: #FFF;
    @apply py-10 px-6;
}

.tenants {
    background-color: #FFF;
    @apply py-10 px-6;
}
</style>