import {atomWithStorage} from "jotai/utils";
import {atom} from "jotai";
import {Client} from "@lib/axios";

interface User {
    token: string
    username: string
}

export const userAtom =
    atomWithStorage<User>('user-info', {
        token: '',
        username: '',
    })


export const clientAtom = atom({
    key: '',
    instance: null as Client | null,
})
