//数据列表
import React, { useState ,useEffect} from 'react';
import {useClient} from "@lib/hook";
import {
    PararmProps,
    HooksProps,
    DatasourceProps,

} from './healthyProps'


/**
 * 
 * @param 定义hooks方法， 抽取公共逻辑
 * @returns 
 */
// const  useDataList =  ({status =0,page=0 ,size=10}: PararmProps)=>{
function useDataList ({status =0,page=0 ,size=10}: PararmProps) :HooksProps{

    const client = useClient();
    const [datasource ,setDataSource] =useState<DatasourceProps>({content:[],totalElements:0 , totalPages:0,number:0,size:10  });
//datasource保存了从服务器端获取到的健康数据列表，包括当前页数据(content)、总元素数(totalElements)、总页数(totalPages)、当前页码(number)和每页大小(size);
        // useEffect( ()=>{
            client.getHealthy({statuc:status, page, size}).then(res =>{
                console.log('res.data',res.data);
                if(res.data.code == 200){
                    let {content, totalElements, totalPages, number, size} =res.data.data;
                    setDataSource({
                        content, totalElements, totalPages, number, size
                    })
                }
                    
            })
    // },[status, page,size]);根据传入的status、page和size参数进行过滤和分页

        // 删除
    const deleteHealthy=(id:string) =>{
        
    }
    //编辑
    const toEdit =(id:string)=>{

    }

    return{
        datasource,
        deleteHealthy,
        toEdit
    }
}

export default useDataList;