/** 
 * 
 * 封装约束信息
*/
import dayjs from "dayjs";

export interface PararmProps{
    status?: number, // 0 待提醒，1 已提醒 ，2 已处理. 传入0代表是健康提醒的列表 
    page?: number,
    size?: number,
    // type: 
}

export interface HealtyPoProps{
    fid?:string,
    fuserId?:string,
    hdesc?: string,
    reminderTimeEnd?:string|null|Date|dayjs.Dayjs |any,
    reminderTimeStart?:string|null|Date|dayjs.Dayjs |any,
    statuc?: number,
    theme?:string,
    updateTime?:string|null|Date|dayjs.Dayjs |any,
    createTime?:string|null|Date|dayjs.Dayjs |any,
    type?:number
}

export interface DatasourceProps{
    content: HealtyPoProps[],
    totalElements: number,
    totalPages: number,
    number: number,
    size: number,
}

export interface HooksProps{
    datasource: DatasourceProps,
    deleteHealthy?: (id:string)=>void,
    toEdit?: (id:string)=>void
}