<script lang="ts" setup>
import { Pages } from "~/lib/constants"
import { withEnsuringUserSignedIn } from "~/lib/modules/IdentityAndAccessManaging/presentation/middlewares/withEnsuringUserSignedIn"
import { fromXlsxBlobToJson } from "~/lib/utils/formatters"
import { Buffer } from 'buffer'
import { onRetrievingLands, type LandDescriptor } from "~/lib/modules/OpenDataManaging/presentation/controllers/onRetrievingLands"
import { type Land } from "~/lib/modules/OpenDataManaging/dtos/Land"
import Center from "~/components/utils/Center.vue"

const exampleXlsxDownloadURL = "https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1EEXa84goexM04b03eZX6OIrFXvaZ0YZaV_G_NMY80Dc&exportFormat=xlsx"

definePageMeta({
    name: Pages.Lands.name,
    middleware: [
        withEnsuringUserSignedIn,
    ],
})

const route = useRoute()
const { tenantId } = route.params as { tenantId: string }
const file = ref<HTMLInputElement>()
const uploading = ref(false)
const items = ref<Land[]>([])
const touched = ref(0)

export type LandInput = {
    縣市: string
    行政區: string
    段: string
    段小段: string
    母號: string | number
    子號: string | number
}

const onFileInputChanged = async (target: HTMLInputElement) => {
    if (!target.files) return
    const file = target.files.item(0)
    if (!file) return
    uploading.value = true
    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const landDescriptors = Array.from(fromXlsxBlobToJson(buffer, ({ 縣市, 行政區, 段, 段小段, 母號, 子號 }: LandInput) => {
            const landDescriptor: LandDescriptor = {
                city: 縣市,
                administrativeDistrict: 行政區,
                section: 段,
                subsection: 段小段 ? 段小段 : "空白",
                parentLotNumber: ("0000" + String(母號)).slice(-4),
                subLotNumber: ("0000" + String(子號)).slice(-4),
            }
            return landDescriptor
        }))
        items.value = await onRetrievingLands(tenantId, ...landDescriptors)
    } finally {
        target.files = null
        uploading.value = false
        touched.value = Date.now()
    }
}

const headers = [
    {
        key: "city",
        title: "縣市",
    },
    {
        key: "administrativeDistrict",
        title: "行政區",
    },
    {
        key: "section",
        title: "段",
    },
    {
        key: "subsection",
        title: "段小段",
    },
    {
        key: "parentLotNumber",
        title: "母號",
    },
    {
        key: "subLotNumber",
        title: "子號",
    },
    {
        key: "assessedCurrentValue",
        title: "公告現值",
    },
    {
        key: "zoningClassification",
        title: "土地使用分區",
    },
]
</script>

<template>
    <v-main>
        <template v-if="touched">
            <v-container>
                <v-data-table :items="items" :headers="headers" hide-default-footer></v-data-table>
            </v-container>
        </template>
        <template v-else>
            <Center>
                <a :href="exampleXlsxDownloadURL">下載查詢範本</a>
            </Center>
        </template>
    </v-main>
    <input ref="file" type="file" style="display: none;"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="(event) => onFileInputChanged(event.target as HTMLInputElement)" />
    <v-btn :loading="uploading" icon="mdi-plus" @click="() => file?.click()" :class="$style['upload-xlsx']"></v-btn>
</template>

<style scoped>
.v-main {
    min-height: calc(100vh - 84px);
}

.v-layout {
    height: 100%;
}
</style>

<style scoped module>
.upload-xlsx {
    @apply fixed right-4 bottom-4;
    z-index: 1000;
}
</style>