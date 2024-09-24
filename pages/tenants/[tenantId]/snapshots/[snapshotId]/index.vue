<script lang="ts" setup>
import { Pages } from "~/lib/constants"
import { withEnsuringUserSignedIn } from "~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedIn"
import { type Registry } from "~/lib/modules/RegistryManaging/dtos/Registry"
import { onCountingRegistries } from "~/lib/modules/RegistryManaging/presentation/controllers/onCountingRegistries"
import { onListingRegistries } from "~/lib/modules/RegistryManaging/presentation/controllers/onListingRegistries"
import { RegistryStatuses } from "~/lib/modules/RegistryManaging/dtos/RegistryStatuses"
import { onStartingParsingRegistry } from "~/lib/modules/RegistryManaging/presentation/controllers/onStartingParsingRegistry"
import { type 建物謄本 } from "~/lib/modules/RegistryManaging/dtos/建物謄本"
import { SnapshotTypes } from "~/lib/modules/SnapshotManaging/dtos/SnapshotTypes"
import { emptyPlaceholder } from "~/lib/constants"
import { onRetrievingRegistry } from "~/lib/modules/RegistryManaging/presentation/controllers/onRetrievingRegistry"
import { type 土地謄本 } from "~/lib/modules/RegistryManaging/dtos/土地謄本"
import { performConfirm } from "~/composables/utils/useConfirm"
import { Collections } from "~/lib/constants"
import { useEventListener } from "~/composables/utils/useEventListener"
import { watchOnce } from "@vueuse/core"
import { type RegistryEvent } from "~/lib/modules/SnapshotManaging/events/RegistryEvent"
import { RegistryEventTypes } from "~/lib/modules/SnapshotManaging/events/RegistryEventTypes"
import { showInfo } from "~/composables/utils/useSnackbar"
import { createConsola } from "consola"
import { getAuth } from "firebase/auth"
import { Root } from "~/lib/constants"
import { copyTextToClipboard } from "~/lib/utils/ui"

definePageMeta({
    name: Pages.Registries.name,
    middleware: [
        withEnsuringUserSignedIn,
    ],
})

const user = getAuth().currentUser!
const route = useRoute()
const { tenantId, snapshotId } = route.params as { tenantId: string, snapshotId: string }
const itemsPerPage = 0
const itemLength = ref(0)
const loading = ref(false)
const items = ref([] as Registry[])
const search = ref('')

onBeforeMount(async () => {
    itemLength.value = await onCountingRegistries(tenantId, snapshotId)
})

const headers = [
    {
        title: '索引',
        sortable: false,
        key: 'index',
        align: 'center' as 'center',
        value: (registry: Record<string, any>) => registry.index,
    },
    {
        title: '內文',
        sortable: false,
        key: 'text',
    },
    {
        title: '行政區',
        sortable: false,
        key: '行政區',
        value: (registry: Record<string, any>) => {
            if (!registry.metadata) return emptyPlaceholder
            if (registry.status !== RegistryStatuses.Done) return emptyPlaceholder
            if (registry.type === SnapshotTypes.Building) return (registry.metadata as 建物謄本).行政區
            if (registry.type === SnapshotTypes.Land) return (registry.metadata as 土地謄本).行政區
            return emptyPlaceholder
        }
    },
    {
        title: '地段',
        sortable: false,
        key: '地段',
        value: (registry: Record<string, any>) => {
            if (!registry.metadata) return emptyPlaceholder
            if (registry.status !== RegistryStatuses.Done) return emptyPlaceholder
            if (registry.type === SnapshotTypes.Building) return (registry.metadata as 建物謄本).地段
            if (registry.type === SnapshotTypes.Land) return (registry.metadata as 土地謄本).地段
            return emptyPlaceholder
        }
    },
    {
        title: '小段',
        sortable: false,
        key: '小段',
        value: (registry: Record<string, any>) => {
            if (!registry.metadata) return emptyPlaceholder
            if (registry.status !== RegistryStatuses.Done) return emptyPlaceholder
            if (registry.type === SnapshotTypes.Building) return (registry.metadata as 建物謄本).小段
            if (registry.type === SnapshotTypes.Land) return (registry.metadata as 土地謄本).小段
            return emptyPlaceholder
        }
    },
    {
        title: '編號',
        sortable: false,
        key: '編號',
        align: 'end' as 'end',
        value: (registry: Record<string, any>) => {
            if (!registry.metadata) return emptyPlaceholder
            if (registry.status !== RegistryStatuses.Done) return emptyPlaceholder
            if (registry.type === SnapshotTypes.Building) return (registry.metadata as 建物謄本).建號
            if (registry.type === SnapshotTypes.Land) return (registry.metadata as 土地謄本).地號
            return emptyPlaceholder
        }
    },
    {
        title: '所需點數',
        sortable: false,
        key: 'pending',
        align: 'end' as 'end',
        value: (registry: Record<string, any>) => {
            const pending = Math.ceil(registry.pending / 1000)
            const total = Math.ceil(registry.total / 1000)
            return `${pending}/${total}`
        }
    },
    {
        title: '狀態',
        sortable: false,
        key: 'status',
        align: 'end' as 'end',
    },
]

const loaded = ref(false)
const updateOptions = async () => {
    loading.value = true
    try {
        items.value = await onListingRegistries(tenantId, snapshotId)
        loaded.value = true
    } finally {
        loading.value = false
    }
}

const processing = computed(() => {
    // for (const registry of items.value) {
    //     if (registry.status === RegistryStatuses.Doing) return true
    // }
    return false
})

const itemSelectable = (registry: Registry) => {
    if (user.uid === Root) return true
    if (registry.status === RegistryStatuses.Doing) return false
    return true
}

const selected = shallowRef<string[]>([])
const creditsToBeUsed = computed(() => {
    let pendingTokens = 0
    for (const registry of items.value) {
        if (!(selected.value).includes(registry.id)) continue
        if (registry.status !== RegistryStatuses.Pending) continue
        pendingTokens += registry.pending
    }
    return Math.ceil(pendingTokens / 1000)
})
const onParseAllButtonClicked = async () => {
    performConfirm(
        `確定要執行嗎？`,
        `解析謄本將會花費 ${creditsToBeUsed.value} 點\n（已解析過的謄本不須要花費額外點數）`,
        async () => {
            for (const registryId of selected.value) {
                const index = items.value.findIndex(({ id }) => id === registryId)
                if (index < 0) continue
                await onStartingParsingRegistry(tenantId, snapshotId, registryId)
                items.value[index].status = RegistryStatuses.Doing
                items.value[index].processed = 0
            }
            selected.value = []
        },
    )
}

const disabled = computed(() => selected.value.length == 0)
const listen = useEventListener<RegistryEvent>(
    Collections
        .SnapshotEvents
        .replace(":snapshotId", snapshotId),
    (path) => {
        const logger = createConsola()
        logger.info(`開始監聽 ${path}`)
    },
)
const unsubscribe = ref<Function>()
watchOnce(loaded, () => {
    unsubscribe.value = listen(async ({ type, data }) => {
        if (![
            RegistryEventTypes.RegistryFragmentParsed,
        ].includes(type)) return
        const { registryId } = data
        const index = items.value.findIndex(({ id }) => id === registryId)
        if (index === -1) return
        const logger = createConsola().withTag(registryId)
        const registry = await onRetrievingRegistry(tenantId, snapshotId, registryId)
        if (!registry) return
        logger.log(`已解析了${(registry.processed * 100 / registry.total).toFixed(1)}%`)
        items.value[index] = registry
    })
})
onBeforeUnmount(() => {
    unsubscribe.value?.()
})

const copyRegistryId = (registryId: string) => copyTextToClipboard(registryId, (text) => showInfo(`已複製「${text}」`))
</script>

<template>
    <v-main>
        <v-container>
            <v-data-table-server v-model="selected" :items-per-page="itemsPerPage" :headers="headers" :items="items"
                :items-length="itemLength" :loading="!loaded || loading" :search="search" item-value="id"
                @update:options="updateOptions" hide-default-footer show-select :item-selectable="itemSelectable">
                <template v-slot:item.index="{ item: { id: registryId, index } }: { item: Registry }">
                    <v-btn variant="plain" @click="() => copyRegistryId(registryId)">{{ index }}</v-btn>
                </template>
                <template v-slot:item.text="{ item: { text } }: { item: Registry }">
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-title>展開</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <pre>{{ text }}</pre>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </template>
                <template v-slot:item.status="{ item: { status, processed, total } }: { item: Registry }">
                    <template v-if="status === RegistryStatuses.Doing">
                        <v-progress-linear :model-value="processed * 100 / total" color="info" height="25">
                            <template v-slot:default="{ value }">
                                <strong>
                                    {{ value.toFixed(1) }}%
                                </strong>
                            </template>
                        </v-progress-linear>
                    </template>
                    <template v-if="status === RegistryStatuses.Done">
                        <v-chip color="success" variant="flat">
                            完成
                        </v-chip>
                    </template>
                    <template v-if="status === RegistryStatuses.Failed">
                        <v-chip color="error" variant="flat">
                            失敗
                        </v-chip>
                    </template>
                </template>
            </v-data-table-server>
        </v-container>
    </v-main>
    <v-fade-transition>
        <v-btn icon="mdi-text-recognition" :disabled="disabled" :class="$style['parse-registry']"
            @click="onParseAllButtonClicked" :loading="processing"></v-btn>
    </v-fade-transition>
</template>

<style scoped>
strong {
    @apply text-white;
}
</style>

<style scoped module>
.parse-registry {
    @apply fixed right-4 bottom-4;
}
</style>