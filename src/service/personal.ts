import {useClient} from "@lib/hook";
import useSWR from "swr";
import {DateRange} from "@mui/x-date-pickers-pro";
import dayjs, {Dayjs} from "dayjs";
import {colorFromHash} from "@lib/helper";
import {useRef} from "react";

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


export const useSleepRecordService = (dateRange: DateRange<Dayjs>) => {
    const client = useClient()
    const old = useRef<{
        recordTime: string
        sleepTime: number
    }[]>([])

    const {data, mutate} = useSWR(
        ["personal/sleepRecord", client, dateRange], async ([_, client, dateRange]) => {
            if (!dateRange.at(0)!.isValid() || !dateRange.at(1)!.isValid()) {
                return old.current
            }
            const start = dateRange.at(0)!.format("YYYY-MM-DD")
            // 向后推一天
            const end = dateRange.at(1)!.format("YYYY-MM-DD")
            const res = await client.getSleepRecordDao(start, end)
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

export const useDrinkRecordService = (dateRange: DateRange<Dayjs>) => {
    const client = useClient()
    const old = useRef<{
        recordTime: string
        drinkVolume: number
        // 饮水次数
        drinkTimes: number
    }[]>([])
    const {data, mutate} = useSWR(
        ["personal/drinkRecord", client, dateRange], async ([_, client, dateRange]) => {
            if (!dateRange.at(0)!.isValid() || !dateRange.at(1)!.isValid()) {
                return old.current
            }
            const start = dateRange.at(0)!.format("YYYY-MM-DD")
            // 向后推一天
            const end = dateRange.at(1)!.format("YYYY-MM-DD")
            const res = await client.getDrinkRecordDao(start, end)
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

export interface ExerciseRecord {
    exerciseType?: string
    exerciseDuration?: number
}

export const useExerciseType = () => {
    const client = useClient()
    const {data, mutate, isLoading} = useSWR(
        ["personal/exerciseType", client], async ([_, client]) => {
            const res = await client.getExerciseTypeDao()
            if (res.data.code !== 200) {
                return []
            }
            return res.data.data.map((item: string) => {
                return {
                    label: item,
                    color: colorFromHash(item)
                }
            })
        }, {
            keepPreviousData: true, fallbackData: [], revalidateOnFocus: false
        }
    )
    const add = async (type: string) => {
        if (data.find((item) => item.label === type)) {
            return
        }
        mutate([...data, {
            label: type,
            color: colorFromHash(type)
        }], false)
    }
    return [data, add, isLoading] as const
}

export const useExerciseRecordService = (dateRange: DateRange<Dayjs>) => {
    const client = useClient()

    const old = useRef<Record<string, string>[]>([])
    const {data, mutate} = useSWR(
        ["personal/exerciseRecord", client, dateRange], async ([_, client, dateRange]) => {
            if (!dateRange.at(0)!.isValid() || !dateRange.at(1)!.isValid()) {
                return old.current
            }
            const start = dateRange.at(0)!.format("YYYY-MM-DD")
            // 向后推一天
            const end = dateRange.at(1)!.format("YYYY-MM-DD")
            // 检测是否为有效时间
            const res = await client.getExerciseRecordDao(start, end)
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

/*
流量 ： 1 - 5
疼痛 ： 1 - 5
便秘 ： true / false
恶心 ： true / false
发冷 ： true / false
膀胱失禁 ： true / false
潮热 ： true / false
 */
export interface MenstruationRecord {
    flow: number
    pain: number
    constipation: boolean
    nausea: boolean
    cold: boolean
    incontinence: boolean
    hot: boolean
}

export const usePredictMenstruationService = () => {
    const client = useClient()
    const {data, mutate} = useSWR(
        ["personal/predictMenstruation", client], async ([_, client]) => {
            const res = await client.predictMenstruationCycleDao()
            if (res.data.code !== 200) {
                return [null, null] as [Dayjs | null, Dayjs | null]
            }
            const dateR = res.data.data
            return [dayjs(dateR[0]), dayjs(dateR[1])] as [Dayjs | null, Dayjs | null]
        }, {
            keepPreviousData: true, fallbackData: [null, null] as [Dayjs | null, Dayjs | null], revalidateOnFocus: false
        }
    )
    return [data, mutate] as const
}

export interface MenstruationVO {
    days: {
        key: string
        value: number
    }[]
    reactions: {
        key: string
        value: number
    }[]
}

export const useMenstruationRecordService = () => {
    const client = useClient()
    const {data, mutate} = useSWR(
        ["personal/menstruationRecord", client], async ([_, client]) => {
            const res = await client.getMenstruationReportDao()
            if (res.data.code !== 200) {
                return {
                    days: [],
                    reactions: []
                } as MenstruationVO
            }
            return res.data.data
        }, {
            keepPreviousData: true, fallbackData: {
                days: [],
                reactions: []
            } as MenstruationVO, revalidateOnFocus: false
        }
    )
    return [data, mutate] as const
}
