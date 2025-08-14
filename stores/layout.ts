import type { GlobalApiFooter } from "@/types/global-api-type"
import type { GlobalApiHeader } from "@/types/global-api-type"

export const useLayoutStore = defineStore('layout', () => {
    const footerData = ref<GlobalApiFooter | null>(null)
    const headerData = ref<GlobalApiHeader | null>(null)

    const updateFooterData = (data: GlobalApiFooter) => {
        footerData.value = data
    }

    const updateHeaderData = (data: GlobalApiHeader) => {
        headerData.value = data
    }
    return {
        footerData,
        headerData,
        updateFooterData,
        updateHeaderData
    }
})