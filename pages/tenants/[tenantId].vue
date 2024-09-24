<script lang="ts" setup>
import { type PageMeta, Pages } from "~/lib/constants"
import { type RouteLocationNormalizedLoaded } from "vue-router"
import { withEnsuringUserSignedIn } from '~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedIn'
import Snackbar from '~/components/utils/Snackbar.vue'
import { useWindowSize } from '@vueuse/core'
import Avatar from '~/components/tenants/tenantId/avatar.vue'
import { onSigningOut } from '~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onSigningOut'
import { type Tenant } from '~/lib/modules/TenantManaging/dtos/Tenant'
import { onRetrievingTenant } from '~/lib/modules/TenantManaging/presentation/controllers/onRetrievingTenant'
import { type Permission } from '~/lib/modules/IdentityAndAccessManaging/dtos/Permission'
import { onJoiningTenant } from '~/lib/modules/TenantManaging/presentation/controllers/onJoiningTenant'
import { Roles } from '~/lib/modules/IdentityAndAccessManaging/dtos/Roles'
import { getAuth } from 'firebase/auth'
import { Root } from '~/lib/constants'
import { PermissionStatuses } from '~/lib/modules/IdentityAndAccessManaging/dtos/PermissionStatuses'
import Center from '~/components/utils/Center.vue'
import { useSnackbar } from "~/composables/utils/useSnackbar"
import Confirm from "~/components/utils/Confirm.vue"
import { useConfirm } from "~/composables/utils/useConfirm"

const route = useRoute()
const page = ref() as Ref<PageMeta>
const lookupPage = (route: RouteLocationNormalizedLoaded<string | symbol>) => {
    for (const page of Object.values(Pages)) {
        if (route.path === page.fullPath(route.params)) return page
    }
}
page.value = lookupPage(route)!
watch(route, (newOne, oldOne) => page.value = lookupPage(newOne)!)

definePageMeta({
    name: Pages.Dashboard.name,
    middleware: [
        withEnsuringUserSignedIn,
    ],
})

const snackbar = useSnackbar()
const confirm = useConfirm()

const permanent = ref(true)
const drawer = ref(true)
const setDrawerState = () => {
    const { width: width } = useWindowSize()
    const onMobile = width.value <= 640
    drawer.value = !onMobile
    permanent.value = !onMobile
}

onMounted(() => {
    setDrawerState()
    window.onresize = setDrawerState
})

const { tenantId } = route.params as { tenantId: string }
const auth = getAuth()
const user = auth.currentUser!

const displayingUsersMenuItem = computed(() => {
    if (user.uid === Root) return true
    if (!permission.value) return false
    if (permission.value.role !== Roles.Owner) return false
    return true
})

const menu = computed(() => {
    const items = [
        {
            to: Pages.Snapshots.fullPath({ tenantId }) + `?page=1`,
            title: Pages.Snapshots.title,
        },
        {
            to: Pages.Lands.fullPath({ tenantId }),
            title: Pages.Lands.title,
        },
    ]
    if (displayingUsersMenuItem.value) items.push({
        to: Pages.Users.fullPath({ tenantId }) + `?page=1`,
        title: Pages.Users.title,
    })
    return items
})
const permission = ref<Permission>()
const tenant = ref<Tenant>()
provide("tenant", tenant)
const loaded = ref(false)

onBeforeMount((async () => {
    const payload = await onRetrievingTenant(tenantId)
    if (payload) {
        tenant.value = payload.tenant
        permission.value = payload.permission
    }
    loaded.value = true
}))

const permitted = computed(() => permission.value && permission.value.status === PermissionStatuses.Approved)

const onJoinButtonClicked = async () => {
    await onJoiningTenant(tenantId)
    const payload = await onRetrievingTenant(tenantId)
    if (payload) {
        tenant.value = payload.tenant
        permission.value = payload.permission
    }
}

</script>

<template>
    <Confirm ref="confirm" />
    <Snackbar ref="snackbar" />
    <template v-if="tenant">
        <v-app v-show="loaded">
            <template v-if="permitted">
                <v-app-bar prominent color="primary">
                    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                    <v-toolbar-title>{{ tenant.name }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-menu rounded>
                        <template v-slot:activator="{ props }">
                            <v-btn icon v-bind="props" size="small">
                                <Avatar />
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-btn variant="text" @click="onSigningOut">
                                    登出
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-app-bar>
                <v-navigation-drawer v-model="drawer" :permanent="permanent" color="surface">
                    <v-list nav>
                        <template v-for="{ to, title } of menu">
                            <v-list-item :to="to">
                                <v-list-item-title :class="$style['navigation-item']">
                                    {{ title }}
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-navigation-drawer>
                <v-main scrollable>
                    <v-layout :class="$style['page-container']">
                        <NuxtPage />
                    </v-layout>
                </v-main>
            </template>
            <template v-else>
                <template v-if="!permission">
                    <Center>
                        <h2>申請加入{{ tenant.name }}</h2>
                        <p><a href="javascript:void(0)" @click="() => onJoinButtonClicked()">點此</a>提出申請。</p>
                    </Center>
                </template>
                <template v-else-if="permission.status === PermissionStatuses.Rejected">
                    <Center>
                        <h2>您提出加入{{ tenant!.name }}的申請已被拒絕</h2>
                        <p>請聯絡管理員。</p>
                    </Center>
                </template>
                <template v-else-if="permission.status === PermissionStatuses.Pending">
                    <Center>
                        <h2>您所提出加入{{ tenant.name }}的申請正在等待審核</h2>
                        <p>請等待管理員審核。</p>
                    </Center>
                </template>
            </template>
        </v-app>
    </template>
</template>

<style scoped module>
.navigation-item {
    @apply text-base;
}

.page-container {
    @apply p-1;
}
</style>

<style scoped>
[v-cloak] {
    @apply hidden;
}
</style>