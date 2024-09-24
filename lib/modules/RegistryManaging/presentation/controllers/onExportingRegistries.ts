import { translateError } from "~/lib/utils/formatters"
import { showError, showSuccess } from "~/composables/utils/useSnackbar"
import { SnapshotTypes } from "~/lib/modules/SnapshotManaging/dtos/SnapshotTypes"
import { fromJsonToXlsxBlob } from "~/lib/utils/formatters"
import { FromBuildingRegistriesToXlsxRecords } from "~/lib/modules/RegistryManaging/presentation/transformers/FromBuildingRegistriesToXlsxRecords"
import { FromLandRegistriesToXlsxRecords } from "~/lib/modules/RegistryManaging/presentation/transformers/FromLandRegistriesToXlsxRecords"
import { showError } from "~/composables/utils/useSnackbar"
import { downloadBlob } from "~/lib/utils/ui"

export const onExportingRegistries = async (tenantId: string, snapshotId: string) => {
    const axios = unref(useNuxtApp().$axios)
    const { registries } = await realEstateDevelopAssistantService.listRegistries(tenantId, snapshotId)
    if (!registries.length) return
    const fromBuildingRegistriesToXlsxRecords = new FromBuildingRegistriesToXlsxRecords()
    const fromLandRegistriesToXlsxRecords = new FromLandRegistriesToXlsxRecords()
    const xlsxRecords: Array<any> = []
    for (const registry of registries) {
        if (registry.type === SnapshotTypes.Building) {
            for (const record of fromBuildingRegistriesToXlsxRecords(registry, xlsxRecords.length))
                xlsxRecords.push(record)
        }
        if (registry.type === SnapshotTypes.Land)
            for (const record of fromLandRegistriesToXlsxRecords(registry, xlsxRecords.length)) xlsxRecords.push(record)
    }

    try {
        const json = Array.from(xlsxRecords)
        const blob = fromJsonToXlsxBlob(json)
        downloadBlob(blob, `${snapshotId}.xlsx`)
    } catch (error) {
        showError((error as Error).message)
    }
}
