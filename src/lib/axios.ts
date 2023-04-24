import axios, {AxiosInstance} from 'axios'
import {LoginParams} from "@service/auth";
import {BasicSign, MenstruationRecord, MenstruationVO} from "@service/personal";
import {DiseaseVO, InquiryRecord, InquiryTopicsVO} from "@service/inquiry";

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
            baseURL: 'https://ladie-rearend.gtio.work',
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

    async getExerciseTypeDao() {
        return await this.axiosClient.get<Res<string[]>>(`personal/exerciseType`)
    }

    async getExerciseRecordDao(startTime: string, endTime: string) {
        return await this.axiosClient.get<Res<Record<string, string>[]>>(`personal/exerciseRecord?startTime=${startTime}&endTime=${endTime}`)
    }

    async updateExerciseRecordDao(type: string, duration: number) {
        return await this.axiosClient.patch<Res<OperateVO>>(`personal/exerciseRecord?type=${type}&duration=${duration}`)
    }

    async addMenstruationRecordDao(dto: MenstruationRecord & {
        startTime: string
        endTime: string
    }) {
        return await this.axiosClient.post<Res<OperateVO>>(`personal/menstruationRecord`, dto)
    }

    // personal/menstruationCycle/predict
    async predictMenstruationCycleDao() {
        return await this.axiosClient.get<Res<[Date, Date]>>(`personal/menstruationCycle/predict`)
    }

    // /personal/menstruationReport
    async getMenstruationReportDao() {
        return await this.axiosClient.get<Res<MenstruationVO>>(`personal/menstruationReport`)
    }

    // /inquiry/register
    async registerInquiryDao(msg: string, topicId?: string) {
        return await this.axiosClient.post<Res<string>>(`inquiry/register/${topicId ? topicId : ''}`, {
            message: msg
        })
    }

    // /inquiry/records/{topicId}
    async getInquiryRecordsDao(topicId: string) {
        return await this.axiosClient.get<Res<InquiryRecord[]>>(`inquiry/records/${topicId}`)
    }

    // diseases/{topicId}
    async getDiseasesDao(topicId: string) {
        return await this.axiosClient.get<Res<DiseaseVO[]>>(`inquiry/diseases/${topicId}`)
    }

    // topics
    async getTopicsDao() {
        return await this.axiosClient.get<Res<InquiryTopicsVO[]>>(`inquiry/topics`)
    }

    // @DeleteMapping(value = "topics/{topicId}")
    async deleteTopicDao(topicId: string) {
        return await this.axiosClient.delete<Res<OperateVO>>(`inquiry/topics/${topicId}`)
    }
}
