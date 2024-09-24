import Confirm from '~/components/utils/Confirm.vue'

const confirm = ref() as Ref<InstanceType<typeof Confirm> | undefined>

export const useConfirm = () => confirm

const confirmOf = () => unref(useConfirm())

export const performConfirm = (title: string, description: string, callable?: any | Promise<any>) => {
    const confirm = confirmOf()
    if (!confirm) return
    confirm.title = title
    confirm.content = description
    confirm.callable = async () => {
        callable?.()
        confirm.close()
    }
    confirm.open()
}