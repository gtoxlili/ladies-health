import React, {Suspense, useState} from "react";
import {
    CircularProgress,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    TextField
} from "@mui/material";
import './style.css'
import {Outlet, useNavigate} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import {AdapterDayjs} from "@mui/x-date-pickers-pro/AdapterDayjs";
import 'dayjs/locale/zh-cn'



const recordRouter = [
    {
        title: '提醒管理',
        link: '/helathy/manage'
    }, {
        title: '我的待办',
        link: '/helathy/todo'
    }, {
        title: '我的已办',
        link: '/helathy/finish'
    }
];
//导航栏
const Record = () => {
    const navigate = useNavigate()

    const [sideStatuc,setSideStatuc]=useState([true,false,false])//初始状态，根据传入的参数index的值更新状态并调用navigate函数导航到对应页面

    const sideClick=(item:any, index:number)=>{
        if(0 === index){
            setSideStatuc([true,false,false])
        }else if(1=== index){
            setSideStatuc([false,true,false])
        }else{
            setSideStatuc([false,false,true])
        }
        navigate(item.link)
    }

    return <div className='flex gap-8 mt-8 h-full'>
        <div className='bg-neutral-50/60 shadow-md rounded-md '>
            <div style={{height:"100px"}}></div>
            <List >
                {recordRouter.map((item, index) => (
                    <ListItemButton
                        sx={{
                            paddingX: '2rem',
                        }}
                        //style={sideStatuc[index] ==true?{color:"green"}:{}}
                        onClick={() => sideClick(item,index)}
                        key={index} alignItems="center">
                        <ListItemText sx={{
                            textAlign: 'center'
                        }} primary={<span className='text-sm'>{item.title}</span>}/>
                    </ListItemButton>
                ))}
            </List>
        </div>
        <div className='bg-neutral-50/60 shadow-md rounded-md flex-1 relative overflow-y-auto'>
            <Suspense
                fallback={<div className='h-screen flex justify-center items-center'>
                    <CircularProgress size='3rem'/>
                </div>}
            >
                <div className='absolute top-0 left-0 b-0 r-0 p-8 w-full'>
                    <LocalizationProvider
                        adapterLocale="zh-cn"
                        dateAdapter={AdapterDayjs}>
                        <Outlet/>
                    </LocalizationProvider>
                </div>
            </Suspense>
        </div>
    </div>
}

const Healty = () => {
    return <div className='flex flex-col h-full'>
        <Record/>
    </div>
}

export default Healty;
