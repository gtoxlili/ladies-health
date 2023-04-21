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
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import {useBasicSignService} from "@service/personal";
import {useClient} from "@lib/hook";
import {enqueueSnackbar} from "notistack";
import {callBackSnackbar} from "@lib/helper";

const SignInfo = () => {
    // 是否为编辑状态
    const [edit, setEdit] = useState(false)
    const [signInfo, mutateInfo, isLoading] = useBasicSignService()

    const client = useClient()
    return <div className='drop-shadow-md'>
        <div className='absolute top-0 left-0 info-title text-sm font-medium flex items-center'>
            基本信息
            <IconButton size='small' onClick={async () => {
                if (isLoading) {
                    enqueueSnackbar('正在加载数据，请稍后', {variant: 'info'})
                    return
                }
                if (edit) {
                    const res = await client.updateBasicSignDao(signInfo);
                    if (res.data.code !== 200) {
                        enqueueSnackbar(res.data.message, {variant: 'warning'})
                        return
                    } else {
                        callBackSnackbar(res.data.data, mutateInfo)
                    }
                    mutateInfo()
                }
                setEdit(!edit)
            }}
                        sx={{ml: 0.5}}>
                {edit ? <CheckIcon sx={{
                    fontSize: '16px',
                }}/> : <EditIcon sx={{
                    fontSize: '16px',
                }}/>}
            </IconButton>
        </div>
        <div className="mt-10 z-20 bg-neutral-50/60 rounded-md pt-8 pb-2 px-8 rounded-tl-none
        grid
        lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3
        gap-x-8 gap-y-2">
            <TextField
                label="年龄"
                value={signInfo.age || ''}
                onChange={(e) => mutateInfo({...signInfo, age: parseInt(e.target.value)}, false)}
                variant="standard"
                size="small"
                color="secondary"
                disabled={!edit}
                sx={isLoading ? {} : {
                    '& .Mui-disabled': {
                        WebkitTextFillColor: 'black !important'
                    }
                }}
                InputLabelProps={{shrink: true}}
            />
            <TextField
                label="身高"
                variant="standard"
                value={signInfo.height || ''}
                onChange={(e) => mutateInfo({...signInfo, height: parseInt(e.target.value)}, false)}
                size="small"
                color="secondary"
                InputProps={{
                    endAdornment: <InputAdornment position="start">cm</InputAdornment>,
                }}
                sx={isLoading ? {} : {
                    '& .Mui-disabled': {
                        WebkitTextFillColor: 'black !important'
                    }
                }}
                disabled={!edit}
                InputLabelProps={{shrink: true}}
            />
            <TextField
                label="体重"
                value={signInfo.weight || ''}
                onChange={(e) => mutateInfo({...signInfo, weight: parseInt(e.target.value)}, false)}
                variant="standard"
                size="small"
                InputProps={{
                    endAdornment: <InputAdornment position="start">kg</InputAdornment>,
                }}
                sx={isLoading ? {} : {
                    '& .Mui-disabled': {
                        WebkitTextFillColor: 'black !important'
                    }
                }}
                color="secondary"
                disabled={!edit}
                InputLabelProps={{shrink: true}}
            />
            <TextField
                label="血压"
                variant="standard"
                value={signInfo.bloodPressure || ''}
                onChange={(e) => mutateInfo({...signInfo, bloodPressure: e.target.value}, false)}
                size="small"
                color="secondary"
                disabled={!edit}
                InputLabelProps={{shrink: true}}
                helperText="收缩压/舒张压"
                sx={isLoading ? {} : {
                    '& .Mui-disabled': {
                        WebkitTextFillColor: 'black !important'
                    }
                }}
            />
            <TextField
                label="心率"
                variant="standard"
                value={signInfo.heartRate || ''}
                onChange={(e) => mutateInfo({...signInfo, heartRate: parseInt(e.target.value)}, false)}
                size="small"
                color="secondary"
                disabled={!edit}
                // 被禁用时，字体黑色 -webkit-text-fill-color
                sx={isLoading ? {} : {
                    '& .Mui-disabled': {
                        WebkitTextFillColor: 'black !important'
                    }
                }}
                InputLabelProps={{shrink: true}}
                InputProps={{
                    endAdornment: <InputAdornment position="start">次/分</InputAdornment>,
                }}
            />
        </div>
    </div>
}
//  '月经周期', '睡眠时长', '运动时长', '饮食习惯', '饮水记录'
const recordRouter = [
    {
        title: '月经周期',
        link: '/personal/menstrual'
    }, {
        title: '睡眠时长',
        link: '/personal/sleep'
    }, {
        title: '运动时长',
        link: '/personal/sport'
    },
    {
        title: '饮水记录',
        link: '/personal/water'
    }
];

const Record = () => {
    const navigate = useNavigate()

    return <div className='flex gap-8 mt-8 h-full'>
        <div className='bg-neutral-50/60 shadow-md rounded-md '>
            <List>
                {recordRouter.map((item, index) => (
                    <ListItemButton
                        sx={{
                            paddingX: '2rem',
                        }}
                        onClick={() => navigate(item.link)}
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

const Personal = () => {
    return <div className='flex flex-col h-full'>
        <SignInfo/>
        <Record/>
    </div>
}

export default Personal
