<script lang="ts" setup>
const opened = ref(false)
const close = () => opened.value = false
const open = () => opened.value = true
const title = ref("")
const content = ref("")
const callable = ref<() => any | Promise<any>>()
defineExpose({
    close,
    open,
    title,
    content,
    callable,
})
</script>

<template>
    <v-dialog v-model="opened" :max-width="375">
        <v-card :title="title" class="rounded-lg">
            <v-card-text>
                {{ content }}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" variant="flat" @click="() => callable?.()">確定</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-card-text {
    @apply whitespace-pre-wrap;
}
</style>