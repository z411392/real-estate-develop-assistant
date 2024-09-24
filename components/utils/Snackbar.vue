<script lang="ts" setup>
type AlertTypes = "error" | "success" | "info" | "warning"
type Emits = ((event: "opened") => void) & ((event: "closed") => void)

const emit = defineEmits<Emits>()
const opened = ref(false)
watch(opened, (opened) => {
    if (opened) emit("opened")
    else emit("closed")
})
const type = ref<AlertTypes>()
const message = ref("")

const alert = (alertType: AlertTypes, object: any = "", timeout: number = 5000) => {
    setTimeout(() => opened.value = false, timeout)
    opened.value = true
    type.value = alertType
    const json = isRef(object) ? unref(object) : object
    const stringified = typeof json === "string" ? json : JSON.stringify(json, null, 4)
    message.value = stringified
}

const info = (object?: any, timeout?: number) => alert("info" as "info", object, timeout)
const error = (object?: any, timeout?: number) => alert("error" as "error", object, timeout)
const warning = (object?: any, timeout?: number) => alert("warning" as "warning", object, timeout)
const success = (object?: any, timeout?: number) => alert("success" as "success", object, timeout)

const close = () => opened.value = false
defineExpose({
    info,
    error,
    warning,
    success,
})
</script>

<template>
    <v-snackbar v-model="opened" color="transparent">
        <v-alert :type="type" @click="close">
            {{ message }}
        </v-alert>
    </v-snackbar>
</template>

<style scoped>
:deep(.v-snackbar__content) {
    @apply p-0;
}
</style>