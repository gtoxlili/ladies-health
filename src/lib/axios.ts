import axios, { AxiosInstance } from 'axios'
import { LoginParams } from "@service/auth";
import { BasicSign, MenstruationRecord, MenstruationVO } from "@service/personal";
import { DiseaseVO, InquiryRecord, InquiryTopicsVO } from "@service/inquiry";
import { config } from "@config";

export interface Res<T> {
    code: number
    message: string
    data: T
}

export interface OperateVO {
    action: string
    rollbackUrl: string
}
export interface healthyPageParam {
    statuc?: number,
    page?: number,  // 前端默认可不传入分页数据， 后面默认0,10
    size?: number
}
export interface healthyParam {
    fid?: string,
    fuserId?: string,
    theme?: string,
    reminderTimeStart?: any | null,
    reminderTimeEnd?: any | null,
    type?: number,
    hdesc?: string,
    statuc?: number
}

export interface healthyParam {
    fid?: string,
    fuserId?: string,
    theme?: string,
    reminderTimeStart?: any | null,
    reminderTimeEnd?: any | null,
    type?: number,
    hdesc?: string,
    statuc?: number
}

// export interface communityParam {
//     fid?: string,
//     fuserId?: string,
//     theme?: string,
//     reminderTimeStart?: any | null,
//     reminderTimeEnd?: any | null,
//     type?: number,
//     hdesc?: string,
//     statuc?: number
// }


export class Client {
    private readonly axiosClient: AxiosInstance

    constructor(token: string) {
        const headers = {
            Authorization: token
        }
        this.axiosClient = axios.create({
            baseURL: config.baseUrl,
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

    // 健康提醒管理相关接口开始

    async getHealthy({ statuc = 0, page = 0, size = 10 }: healthyPageParam) {
        let url = `healthy/getHealthy?page=${page}&size=${size}`;
        if (statuc !== 0) {
            url = `${url}&statuc=${statuc}`;
        }
        return await this.axiosClient.get(url);
    }

    async deleteHealthy(id: string) {
        return await this.axiosClient.delete(`healthy/deleteHealthy?fid=${id}`);
    }

    async saveHealthy(param: healthyParam) {
        return await this.axiosClient.post('healthy/save', param);
    }
    async updateHealthy(param: healthyParam) {
        return await this.axiosClient.post('healthy/update', param);
    }

    async getHealtyCount() {
        return await this.axiosClient.get(`healthy/getCount`);
    }

    async finishHealthy(fid: string) {
        return await this.axiosClient.get(`healthy/finish?fid=${fid}`)
    }

    async getHealthyDetail(fid: string) {
        return await this.axiosClient.get(`healthy/detail?fid=${fid}`)
    }
    // 健康管理相关接口结束

    //社区交流接口开始
    async getThemeList(params: any) {
        return await this.axiosClient.post('community/themelist', params);
    }

    async getCommentList(params: any) {
        return await this.axiosClient.post('community/commentlist', params);
    }

    async getReplyList(params: any) {
        return await this.axiosClient.post('community/replylist', params);
    }

    async getNotificationsList(params: any) {
        return await this.axiosClient.post('community/notificatonslist', params);
    }

    async Discuss(params: any) {
        return await this.axiosClient.post('community/discuss', params);
    }

    async Recommended(params: any) {
        return await this.axiosClient.post('community/recommended', params);
    }

    async LikesList(params: any) {
        return await this.axiosClient.post('community/likesList', params);
    }
    
    async AllLikesList(params: any) {
        return await this.axiosClient.post('community/alllikesList', params);
    }

    async Like(params: any) {
        return await this.axiosClient.post('community/like', params);
    }

    async cancelLike(params: any) {
        return await this.axiosClient.post('community/cancelLike', params);
    }
    //社区交流接口结束
}
