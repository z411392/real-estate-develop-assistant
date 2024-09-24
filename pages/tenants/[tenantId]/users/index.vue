<script lang="ts" setup>
import { Pages } from "~/lib/constants"
import { withEnsuringUserSignedIn } from "~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedIn"
import { onCountingUsers } from "~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onCountingUsers"
import { onListingUsers, type UserWithPermission } from "~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onListingUsers"
import { PermissionStatuses } from "~/lib/modules/IdentityAndAccessManaging/dtos/PermissionStatuses"
import PQueue from "p-queue"
import { onReviewingJoining } from "~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onReviewingJoining"
import { onRetrievingPermission } from "~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onRetrievingPermission"
import { Roles } from "~/lib/modules/IdentityAndAccessManaging/dtos/Roles"
import { getAuth } from "firebase/auth"

definePageMeta({
    name: Pages.Users.name,
    middleware: [
        withEnsuringUserSignedIn,
    ],
})

const user = getAuth().currentUser!
const route = useRoute()
const { tenantId } = route.params as { tenantId: string }
const itemLength = ref(0)
const loading = ref(false)
const items = ref([] as UserWithPermission[])
const search = ref('')

onBeforeMount(async () => {
    itemLength.value = await onCountingUsers(tenantId)
})

const headers = [
    {
        title: '#',
        sortable: false,
        key: 'id',
    },
    {
        title: '成員',
        sortable: false,
        key: 'user',
    },
    {
        title: '',
        sortable: false,
        key: "ops",
        align: 'center' as 'center',
    },
    {
        title: '狀態',
        sortable: false,
        key: 'status',
        align: 'end' as 'end',
    },
]

const page = ref(Math.max(((route.query["page"] as any) >>> 0), 1))
const updateOptions = async () => {
    loading.value = true
    try {
        items.value = await onListingUsers(tenantId, page.value)
    } finally {
        loading.value = false
    }
}

const queue = new PQueue({ concurrency: 3 })

const onReviewingButtonClicked = async (permissionId: string, status: PermissionStatuses) => {
    const index = items.value.findIndex(({ permission: { id } }) => id === permissionId)
    if (index < 0) return
    items.value[index].permission.status = PermissionStatuses.Reviewing
    await queue.add(async () => {
        await onReviewingJoining(tenantId, permissionId, status)
        const permission = await onRetrievingPermission(tenantId, permissionId)
        if (permission) items.value[index].permission = permission
    })
}
</script>

<template>
    <v-main>
        <v-container>
            <v-data-table-server :headers="headers" :items="items" :items-length="itemLength" :loading="loading"
                :search="search" item-value="id" @update:options="updateOptions" disable-items-per-page :page="page">
                <template v-slot:item.user="{ item: user }: { item: UserWithPermission }">
                    <v-badge :content="user.displayName" location="bottom center">
                        <v-avatar>
                            <v-img :src="user.photoURL"></v-img>
                        </v-avatar>
                    </v-badge>
                </template>
                <template v-slot:item.status="{ item: { permission: { status } } }: { item: UserWithPermission }">
                    <template v-if="status === PermissionStatuses.Reviewing">
                        <v-chip color="info" variant="flat">
                            處理審核中
                        </v-chip>
                    </template>
                    <template v-if="status === PermissionStatuses.Pending">
                        <v-chip color="info" variant="flat">
                            待審核
                        </v-chip>
                    </template>
                    <template v-if="status === PermissionStatuses.Approved">
                        <v-chip color="success" variant="flat">
                            已加入
                        </v-chip>
                    </template>
                    <template v-if="status === PermissionStatuses.Rejected">
                        <v-chip color="error" variant="flat">
                            已拒絕
                        </v-chip>
                    </template>
                </template>
                <template
                    v-slot:item.ops="{ item: { id: userId, permission: { id: permissionId, status, role } } }: { item: UserWithPermission }">
                    <template v-if="userId !== user.uid && role !== Roles.Owner">
                        <template v-if="status !== PermissionStatuses.Approved">
                            <v-btn icon="mdi-check-circle-outline" variant="flat"
                                :loading="status === PermissionStatuses.Reviewing"
                                @click="() => onReviewingButtonClicked(permissionId, PermissionStatuses.Approved)"></v-btn>
                        </template>
                        <template v-else>
                            <v-btn icon="mdi-close-circle-outline" variant="flat"
                                @click="() => onReviewingButtonClicked(permissionId, PermissionStatuses.Rejected)"></v-btn>
                        </template>
                    </template>
                </template>
            </v-data-table-server>
        </v-container>
    </v-main>
</template>