// 处理登录逻辑
import {useClient} from "@lib/hook";
import {userAtom} from "@stores/jotai";
import {useState} from "react";
import {enqueueSnackbar} from "notistack";
import {useSetAtom} from "jotai";
import {useNavigate} from "react-router-dom";

export interface LoginParams {
    loginType: 'email' | 'phone' | 'username'
    args: string
    password: string
    rememberMe: boolean
}

export const useLoginService = () => {
    const client = useClient()
    const setUserInfo = useSetAtom(userAtom)
    // 是否正在登录
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handler = async (data: LoginParams) => {
        setLoading(true)
        const res = await client.loginDao(data.loginType, data.args, data.password, data.rememberMe);
        setLoading(false)
        if (res.data.code != 200) {
            enqueueSnackbar(res.data.message, {variant: 'error'})
            return
        }
        console.log(`登录成功，token为：${res.headers["authorization"]}`)
        setUserInfo({
            token: res.headers["authorization"] as string,
            username: res.data.data.username,
        })
        enqueueSnackbar('登录成功 | 跳转至主页', {variant: 'success'})
        navigate('/', {replace: true})
    }
    return {handler, loading}
}

export interface RegisterParams {
    username: string
    phone: string
    email: string
    password: string
}

export const useRegisterService = () => {
    const client = useClient()
    const setUserInfo = useSetAtom(userAtom)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const handler = async (data: RegisterParams) => {
        setLoading(true)
        const res = await client.registerDao(data.username, data.phone, data.email, data.password);
        setLoading(false)
        if (res.data.code != 200) {
            enqueueSnackbar(res.data.message, {variant: 'error'})
            return
        }
        console.log(`注册成功，token为：${res.headers["authorization"]}`)
        setUserInfo({
            token: res.headers["authorization"] as string,
            username: res.data.data.username,
        })
        enqueueSnackbar('注册成功 | 跳转至主页', {variant: 'success'})
        navigate('/', {replace: true})
    }
    return {handler, loading}
}
