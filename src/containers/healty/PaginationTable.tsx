//分页
import React, { useState,useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination ,Button, Alert ,AlertTitle} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
// import useDataList from './useDataList';
import {useClient} from "@lib/hook";

interface ParamProps{
    statuc: number,
}//ParamProps接口用于传参

import {
    HealtyPoProps,
} from './healthyProps'
//从healthyProps模块导入 HealtyPoProps接口，该接口定义了健康数据的属性



const PaginationTable = ({statuc =0 }:ParamProps) => {

    const columns=[
        {
            id:1,
            label:"主题",
            key:"theme",
            width: 100,
        },
        {
            id:2,
            label:"提醒类型",
            key:"type",
            width: 90,
            render:(type:number) =>{
                return type===0?"页面提醒":type===1?"邮件提醒":"短信提醒"
            }
        },
        {
            id:3,
            label:"状态",
            key:"statuc",
            width: 90,
            render:(statuc:number) =>{
                return statuc===0?"待提醒":statuc===1?"已提醒":"已完成"
            }
        },
        {
            id:4,
            label:"开始时间",
            key:"reminderTimeStart",
            width: 120,
        },
        {
            id:5,
            label:"结束时间",
            key:"reminderTimeEnd",
            width: 120,
        },
        {
            id:7,
            label:"操作",
            key:"operation",
            width: 170,
        },
    ]

    
    // const data:any =[]

    const navigate = useNavigate()//用于实现页面跳转


    const client = useClient();//获取数据的API接口

    const [page, setPage] = useState(0);//用于显示健康数据列表的分页信息
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElements, setTotalElements] =useState(0)
    const [totalPages, setTotalPages] =useState(0)

    const [dataList, setDataList]  =useState<HealtyPoProps[]>([]);//健康数据列表的实际数据。

    useEffect(()=>{
        getHealthyDataList();
    },[statuc])//监听statuc变量的变化，并触发getHealthyDataList()函数从服务器端获取相应的健康数据列表。

    const  getHealthyDataList= (page?:number ,size?:number)=>{
        client.getHealthy({statuc, page, size}).then(res =>{
            if(res.data.code == 200){
                let {content, totalElements, totalPages} =res.data.data;
                setDataList(content )
                setTotalElements(totalElements);
                setTotalPages(totalPages)
            }
        })
    }//该函数中使用了client.getHealthy()方法来获取健康数据，并将结果存储在state中以便组件渲染。
    //如果获取成功，则会将健康数据列表存储在dataList中，并更新页码等分页变量。

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
        getHealthyDataList(newPage, rowsPerPage)
    }//用于在用户翻页时更新组件内部状态

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getHealthyDataList(0, parseInt(event.target.value, 10))
    }//用于在用户更改每页显示记录数时更新组件内部状态
    
    // 删除
  
    const deleteHealthy=(id:string) =>{
        client.deleteHealthy(id).then((res:any) =>{
            let code=   res.data.code 
            if(code === 200){
                enqueueSnackbar('删除成功', {variant: 'success'})
            }else{
                enqueueSnackbar('删除失败', {variant: 'error'})
            }
            getHealthyDataList();
        })
    }
    //完成
    const approve =(id:string)=>{
        client.finishHealthy(id).then(res =>{
            let code=   res.data.code ;
            if(code === 200){
                enqueueSnackbar('已完成', {variant: 'success'})
            }else{
                enqueueSnackbar('完成失败', {variant: 'error'})
            }
            getHealthyDataList();
        })
    }
    //编辑
    const toEdit =(id:string)=>{
        navigate("/helathy/edit",{state:{fid: id,type:"edit"}})
    }
  //详情
    const toDetail =(id:string)=>{
        navigate("/helathy/detail",{state:{fid: id}})
    }

    return (
        <div style={{background: "rgba(247,228,230)", width:"100%"}} >
        <TableContainer component={Paper} variant="outlined" style={{background: "rgba(251,232,232)"}}>
            <Table aria-label="customized table">
                <TableHead style={{fontWeight: 'bold'}}>
                    <TableRow>
                        {columns.map((column: any) => (
                            <TableCell width={column.width} align='center' key={column.id}><b>{column.label}</b></TableCell>
                        ))}
                    </TableRow>
                </TableHead> 
                <TableBody>
                    {dataList.map((row:any) => (
                        <TableRow key={row.fid}>
                            {columns.map((column: any, index ) => {
                                if(index == columns.length-1){
                                    return <TableCell align='center'>
                                        {
                                            statuc ==0?(
                                                <div>
                                                    <Button disabled={row.statuc == 1 || row.statuc ==2 } variant="contained" color="info" onClick={()=>{toEdit(row.fid)}} sx={{width: 40}}>编辑</Button>
                                                    <Button disabled={row.statuc == 1} variant="contained" style={{marginLeft:"10px"}} color="warning" onClick={()=>{deleteHealthy(row.fid)}} sx={{width: 40}}>删除</Button>
                                                </div>
                                            
                                            ):statuc ==1?(<div>
                                                <Button variant="contained" style={{marginLeft:"10px"}} color="success" onClick={()=>{approve(row.fid)}} sx={{width: 40}}>完成</Button>
                                            </div>):<div>
                                                <Button variant="contained" style={{marginLeft:"10px"}} color="warning" onClick={()=>{ deleteHealthy(row.fid) }} sx={{width: 40}}>删除</Button>
                                            </div>
                                        }
                                        </TableCell>
                                }
                                return <TableCell align='center' onClick={()=>{toDetail(row.fid) }} width={column.width} key={row.fid}>{column.render?(column.render(row[column.key])) :(row[column.key])}</TableCell>
                            })}
                        </TableRow>
                    ))}
                    
                </TableBody>
            
            </Table>
            <TablePagination
                rowsPerPageOptions={[5,10, 15]}
                component="div"
                labelRowsPerPage="每页条数:"
                labelDisplayedRows={({ from, to, count }) =>`当前页:${page+1} 总条数:${count}`}
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>

        {/* <Alert severity="warning" >
            <AlertTitle>Warning</AlertTitle>
            This is a warning alert — <strong>check it out!</strong>
        </Alert>
         */}
        </div>
    );
};

export default PaginationTable;