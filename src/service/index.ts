// 检测是否为登录状态
import {useClient} from "@lib/hook";
import useSWR from "swr";

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
