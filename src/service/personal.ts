import {useClient} from "@lib/hook";
import useSWR from "swr";
import {DateRange} from "@mui/x-date-pickers-pro";
import {Dayjs} from "dayjs";

export interface BasicSign {
    age?: number
    height?: number
    weight?: number
    bloodPressure?: string
    heartRate?: number
}

export const useBasicSignService = () => {
    const client = useClient()
    const {data, mutate, isLoading} = useSWR(
        ["personal/basicSign", client], async ([_, client]) => {
            const res = await client.getBasicSignDao()
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: {
                age: undefined,
                height: undefined,
                weight: undefined,
                bloodPressure: "",
                heartRate: undefined
            }, revalidateOnFocus: false
        }
    )
    return [data, mutate, isLoading] as const
}

export interface SleepRecord {
    duration: number
}

export const useSleepRecordService = (dateRange: DateRange<Dayjs>) => {
    const client = useClient()
    const {data, mutate} = useSWR(
        ["personal/sleepRecord", client, dateRange], async ([_, client, dateRange]) => {
            const start = dateRange.at(0)!.format("YYYY-MM-DD")
            // 向后推一天
            const end = dateRange.at(1)!.add(1, "day").format("YYYY-MM-DD")
            const res = await client.getSleepRecordDao(start, end)
            if (res.data.code !== 200) {
                return []
            }
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: [], revalidateOnFocus: false
        }
    )
    return [data, mutate] as const
}

export const useDrinkRecordService = (dateRange: DateRange<Dayjs>) => {
    const client = useClient()
    const {data, mutate} = useSWR(
        ["personal/drinkRecord", client, dateRange], async ([_, client, dateRange]) => {
            const start = dateRange.at(0)!.format("YYYY-MM-DD")
            // 向后推一天
            const end = dateRange.at(1)!.add(1, "day").format("YYYY-MM-DD")
            const res = await client.getDrinkRecordDao(start, end)
            if (res.data.code !== 200) {
                return []
            }
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: [], revalidateOnFocus: false
        }
    )
    return [data, mutate] as const
}
