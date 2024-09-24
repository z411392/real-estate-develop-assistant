<template>
    <v-layout>
        <v-row>
            <v-col>
                <v-spacer />
                <v-row>
                    <v-spacer />
                    <v-sheet>
                        <slot></slot>
                    </v-sheet>
                    <v-spacer />
                </v-row>
                <v-spacer />
            </v-col>
        </v-row>
    </v-layout>
</template>

<style scoped>
.v-container {
    @apply h-screen;
}

.v-col {
    @apply flex flex-col;
}

.v-sheet {
    @apply self-center;
}

.v-btn {
    @apply self-center block text-center mx-auto my-0;
}
</style>