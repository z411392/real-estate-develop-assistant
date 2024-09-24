import Snackbar from '~/components/utils/Snackbar.vue'

const snackbar = ref() as Ref<InstanceType<typeof Snackbar> | undefined>

export const useSnackbar = () => snackbar

const snackbarOf = () => unref(useSnackbar())

export const showInfo = (object?: any, timeout?: number) => {
    const snackbar = snackbarOf()
    snackbar?.info(object, timeout)
}

export const showError = (object?: any, timeout?: number) => {
    const snackbar = snackbarOf()
    snackbar?.error(object, timeout)
}

export const showWarning = (object?: any, timeout?: number) => {
    const snackbar = snackbarOf()
    snackbar?.warning(object, timeout)
}

export const showSuccess = (object?: any, timeout?: number) => {
    const snackbar = snackbarOf()
    snackbar?.success(object, timeout)
}