import type { GlobalApiFooter } from "@/types/global-api-type"
import type { GlobalApiHeader } from "@/types/global-api-type"

export const useLayoutStore = defineStore('layout', () => {
    const footerData = ref<GlobalApiFooter | null>(null)
    const headerData = ref<GlobalApiHeader | null>(null)

    const updateFooterData = (data: GlobalApiFooter) => {
        console.log('Store - Updating footer data:', data)
        footerData.value = data
        console.log('Store - Footer data after update:', footerData.value)
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