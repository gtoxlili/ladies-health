import axios, {AxiosInstance} from 'axios'
import {LoginParams} from "@service/auth";
import {BasicSign} from "@service/personal";
import dayjs, {Dayjs} from "dayjs";

export interface Res<T> {
    code: number
    message: string
    data: T
}

export interface OperateVO {
    action: string
    rollbackUrl: string
}


export class Client {
    private readonly axiosClient: AxiosInstance

    constructor(token: string) {
        const headers = {
            Authorization: token
        }
        this.axiosClient = axios.create({
            baseURL: '/api',
            headers: headers,
        })
    }

    async loginDao(type: LoginParams['loginType'], args: string, password: string, rememberMe: boolean) {
        const req: any = {
            password: password,
            rememberMe: rememberMe
        }
        req[type] = args
        return await
            this.axiosClient.post<Res<{ username: string }>>(`auth/login/${type}`, req)
    }

    async registerDao(username: string, phone: string, email: string, password: string) {
        return await
            this.axiosClient.post<Res<{ username: string }>>(`auth/register/user`, {
                username: username,
                phone: phone,
                email: email,
                password: password
            })
    }

    async checkAuthDao() {
        return await this.axiosClient.get<Res<null>>(`checkAuth`)
    }

    async getBasicSignDao() {
        return await this.axiosClient.get<Res<BasicSign>>(`personal/basicSign`)
    }

    async updateBasicSignDao(sign: BasicSign) {
        return await this.axiosClient.post<Res<OperateVO>>(`personal/basicSign`, sign)
    }

    // 回滚行为
    async rollbackDao(url: string) {
        return await this.axiosClient.get<Res<null>>(url)
    }

    async getSleepRecordDao(startTime: string, endTime: string) {
        return await this.axiosClient.get<Res<{
            recordTime: string
            sleepTime: number
        }[]>>(`personal/sleepRecord?startTime=${startTime}&endTime=${endTime}`)
    }

    async updateSleepRecordDao(duration: number) {
        return await this.axiosClient.patch<Res<OperateVO>>(`personal/sleepRecord?duration=${duration}`)
    }

    async getDrinkRecordDao(startTime: string, endTime: string) {
        return await this.axiosClient.get<Res<{
            recordTime: string
            drinkVolume: number
            // 饮水次数
            drinkTimes: number
        }[]>>(`personal/drinkRecord?startTime=${startTime}&endTime=${endTime}`)
    }

    async updateDrinkRecordDao(duration: number) {
        return await this.axiosClient.patch<Res<OperateVO>>(`personal/drinkRecord?volume=${duration}`)
    }
}
