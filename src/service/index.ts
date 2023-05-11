// 检测是否为登录状态
import {useClient} from "@lib/hook";
import useSWR from "swr";
import {enqueueSnackbar} from "notistack";

export const useCheckAuth = () => {
    const client = useClient()
    const {error} = useSWR(
        ["heartbeat", client], async ([_, client]) => {
            const res = await client.checkAuthDao()
            if (res.data.code === 200) {
                return true
            } else {
                throw new Error(res.data.message)
            }
        })
    return error
}

// 健康提醒论询
export const useHealthReminder = (error: Error) => {
    const client = useClient()
    useSWR(
        ["reminder", error, client], async ([_, error, client]) => {
            if (error) return
            const res = await client.getHealtyCount()
            if (res.data.code === 200) {
                enqueueSnackbar(`您有${res.data.data}待处理, 请您到【健康管理/待办】查阅`, {variant: 'success'})
            }
        }, {revalidateOnFocus: false})
}
