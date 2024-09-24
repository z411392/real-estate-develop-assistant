<script lang="ts" setup>
import { Pages } from '~/lib/constants'
const route = useRoute()
const { tenantId } = route.params as { tenantId: string }
await navigateTo(Pages.Snapshots.fullPath({ tenantId }) + `?page=1`)
</script>