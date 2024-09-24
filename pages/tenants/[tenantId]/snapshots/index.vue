<script lang="ts" setup>
import { Pages } from "~/lib/constants"
import { withEnsuringUserSignedIn } from "~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedIn"
import { PageSizes } from "~/lib/constants"
import { onCountingSnapshots } from "~/lib/modules/SnapshotManaging/presentation/controllers/onCountingSnapshots"
import { onListingSnapshots, type SnapshotWithUser } from "~/lib/modules/SnapshotManaging/presentation/controllers/onListingSnapshots"
import { SnapshotTypes } from "~/lib/modules/SnapshotManaging/dtos/SnapshotTypes"
import { DatetimeFormats } from "~/lib/constants"
import { DateTime } from "luxon"
import { onExportingRegistries } from "~/lib/modules/RegistryManaging/presentation/controllers/onExportingRegistries"
import { Buffer } from 'buffer'
import { onUploadingSnapshot } from "~/lib/modules/SnapshotManaging/presentation/controllers/onUploadingSnapshot"
import { type VDataTableServer } from 'vuetify/components'

definePageMeta({
    name: Pages.Snapshots.name,
    middleware: [
        withEnsuringUserSignedIn,
    ],
})

const route = useRoute()
const { tenantId } = route.params as { tenantId: string }
const itemsPerPage = PageSizes.Snapshots
const itemLength = ref(0)
const loading = ref(false)
const items = ref([] as SnapshotWithUser[])
const search = ref('')

onBeforeMount(async () => {
    itemLength.value = await onCountingSnapshots(tenantId)
})

const headers = [
    {
        title: '檔名',
        sortable: false,
        key: 'name',
    },
    {
        title: '類型',
        sortable: false,
        key: 'type',
        value: (snapshot: Record<string, any>) => {
            if (snapshot.type === SnapshotTypes.Building) return "建物謄本"
            if (snapshot.type === SnapshotTypes.Land) return "土地謄本"
            return ""
        }
    },
    {
        title: '上傳時間',
        sortable: false,
        key: 'createdAt',
        value: (snapshot: Record<string, any>) => DateTime.fromMillis(snapshot.createdAt).toFormat(DatetimeFormats.ISO8601)
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
        align: 'end' as 'end',
    },
]

const page = ref(Math.max(((route.query["page"] as any) >>> 0), 1))
const updateOptions = async () => {
    loading.value = true
    try {
        items.value = await onListingSnapshots(tenantId, page.value)
    } finally {
        loading.value = false
    }
}
const file = ref<HTMLInputElement>()
const uploading = ref(false)
const table = ref<VDataTableServer>()
const onFileInputChanged = async ({ target }: Event & { target: HTMLInputElement }) => {
    const files: FileList | undefined = target.files || undefined
    if (!files) return
    const file = files.item(0)
    if (!file) return
    uploading.value = true
    const content = Buffer.from(await file.arrayBuffer()).toString("base64")
    await onUploadingSnapshot(tenantId, file.name, content)
    target.files = null
    uploading.value = false
    await updateOptions()
}
</script>

<template>
    <v-main>
        <v-container>
            <v-data-table-server ref="table" :items-per-page="itemsPerPage" :headers="headers" :items="items"
                :items-length="itemLength" :loading="loading || uploading" :search="search" item-value="id"
                @update:options="updateOptions" disable-items-per-page :page="page">
                <template v-slot:item.name="{ item: { id: snapshotId, name } }: { item: SnapshotWithUser }">
                    <a :href="Pages.Registries.fullPath({ tenantId, snapshotId })">
                        {{ name }}
                    </a>
                </template>
                <template v-slot:item.user="{ item: { user } }: { item: SnapshotWithUser }">
                    <v-badge :content="user.displayName" location="bottom center">
                        <v-avatar>
                            <v-img :src="user.photoURL"></v-img>
                        </v-avatar>
                    </v-badge>
                </template>
                <template v-slot:item.ops="{ item: { downloadURL, id: snapshotId } }: { item: SnapshotWithUser }">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                        </template>
                        <v-list>
                            <v-list-item :href="downloadURL" target="_blank">
                                <v-list-item-title>下載原始謄本</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="() => onExportingRegistries(tenantId, snapshotId)">
                                <v-list-item-title>
                                    匯出為 .xlsx
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table-server>
        </v-container>
    </v-main>
    <input ref="file" type="file" style="display: none;" accept="application/pdf"
        @change="(event) => onFileInputChanged(event as any)" />
    <v-btn :loading="uploading" icon="mdi-plus" @click="() => file?.click()" :class="$style['upload-snapshot']"></v-btn>
</template>

<style scoped module>
.upload-snapshot {
    @apply fixed right-4 bottom-4;
}
</style>