import {useClient} from "@lib/hook";
import {useDeferredValue, useLayoutEffect, useMemo, useRef, useState} from "react";
import useSWR from "swr";
import {enqueueSnackbar} from "notistack";
import {config} from "@config";

export interface InquiryRecord {
    role: 'assistant' | 'user'
    message: string
}

export const useInquiryRecordsService = (topicId?: string) => {
    const client = useClient()
    const old = useRef<InquiryRecord[]>([])
    const {data, mutate} = useSWR(
        ["inquiry/records", client, topicId], async ([_, client, topicId]) => {

            if (!topicId) {
                return []
            }
            const res = await client.getInquiryRecordsDao(topicId)
            if (res.data.code !== 200) {
                return old.current
            }
            old.current = res.data.data
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: [], revalidateOnFocus: false
        }
    )
    return [data, mutate] as const
}

export function useInquiryReader(
    id: string | null,
    // 对于传回来的字符串如何处理
    onMessage: (message: string) => string,
    onEnd?: () => void,
) {
    const [value, setValue] = useState<string>("")
    const deferredText = useDeferredValue(value)
    const resultText = useMemo(() => {
        return onMessage(deferredText)
    }, [deferredText])

    useLayoutEffect(() => {
        if (!id) return
        setValue("")
        const source = new EventSource(`${config.baseUrl}inquiry/completions/${id}`)
        source.onmessage = (event) => setValue(value => value + event.data)
        // @ts-ignore
        source.onerror = (event: Event & { data: string }) => {
            if (event.data) {
                enqueueSnackbar(event.data, {variant: "warning"})
                onEnd && onEnd()
            }
            source.close()
        }
        onEnd && source.addEventListener("end", () => onEnd())
        return () => source.close()
    }, [id])

    return resultText
}

export interface DiseaseVO {
    name: string
    detail: string
}

export const useDiseasesService = (topicId?: string) => {
    const client = useClient()
    const old = useRef<DiseaseVO[]>([])
    const {data} = useSWR(
        ["inquiry/diseases", client, topicId], async ([_, client, topicId]) => {
            if (!topicId) {
                return []
            }
            const res = await client.getDiseasesDao(topicId)
            if (res.data.code !== 200) {
                return old.current
            }
            old.current = res.data.data
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: [], revalidateOnFocus: false
        }
    )
    return [data] as const
}

export interface InquiryTopicsVO {
    topicId: string
    title: string
}

export const useTopicsService = () => {
    const client = useClient()
    const old = useRef<InquiryTopicsVO[]>([])
    const {data, mutate} = useSWR(
        ["inquiry/topics", client], async ([_, client]) => {
            const res = await client.getTopicsDao()
            if (res.data.code !== 200) {
                return old.current
            }
            old.current = res.data.data
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: [], revalidateOnFocus: false
        }
    )
    return [data, mutate] as const
}
