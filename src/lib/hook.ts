import {useAtom, useAtomValue} from "jotai";
import {Client} from "@lib/axios";
import {clientAtom, userAtom} from "@stores/jotai";


export function useClient() {
    const userInfo = useAtomValue(userAtom)
    const [item, setItem] = useAtom(clientAtom)
    if (item.key !== userInfo.token || !item.instance) {
        setItem({
            key: userInfo.token,
            instance: new Client(userInfo.token),
        })
    }
    return item.instance!
}

