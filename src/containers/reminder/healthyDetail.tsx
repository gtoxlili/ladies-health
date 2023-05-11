import React, { useEffect, useState } from "react";

import { Grid, TextField, TextareaAutosize, MenuItem, Typography,IconButton } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { DateTimePicker } from '@mui/x-date-pickers-pro';
import './healthy.css'
import {HealtyPoProps} from './healthyProps'
import {enqueueSnackbar} from "notistack";
import {useClient} from "@lib/hook";
import {useNavigate} from "react-router-dom";

function HealtyDetail() {

    const { state } = useLocation();
    // console.log('HealtyAdd...state', state);
    const client = useClient();

    const typeOption = [
        { value: 0, label: '桌面提醒' },
        { value: 1, label: '邮件提醒' },
        { value: 2, label: '短信提醒' },
    ];

    const navigate = useNavigate()

    const [formData, setFormData] = useState<HealtyPoProps>({
        theme: '',
        type: 0,
        reminderTimeStart: null ,
        reminderTimeEnd: null ,
        hdesc:"",
        fid:"",
        createTime: null,
        updateTime: null ,
        statuc: 0
    });

    useEffect(()=>{
        
        let fid= state.fid;
        client.getHealthyDetail(fid).then(res =>{
            let code =res.data.code;
            if(code ===200){
                let data =res.data.data;
                let reminderTimeEnd= dayjs(data.reminderTimeEnd);
                let reminderTimeStart=dayjs(data.reminderTimeStart)
                let createTime =dayjs(data.createTime)
                setFormData({
                    ...data, reminderTimeEnd,reminderTimeStart,createTime
                })
            }else{
                enqueueSnackbar('详情信息查询失败!', {variant: 'error'})
            }
        })
    },[state])

    return (
        <>
            <Typography variant="subtitle2" mb={2} ml={0.5}>
            <IconButton size="small" onClick={()=>navigate(-1)}>
                <ArrowBackIcon  sx={{
                        color: 'black',
                    }} />
            </IconButton>
                <span style={{ fontSize: "16px" }}><b> 提醒详情</b></span>
            </Typography>

            <form style={{ marginTop: "55px" }} >

                <Typography variant="subtitle2" mb={2} ml={0.5}>
                    提醒信息
                </Typography>

                <Grid container spacing={2} >
                    <Grid item xs={6}>
                        <TextField 
                            // required
                            
                            fullWidth
                            disabled
                            label="主题"
                            name="theme"
                            value={formData.theme}
                            // onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            disabled
                            fullWidth
                            label="提醒方式"
                            name="type"
                            
                            value={formData.type}
                            // onChange={handleInputChange}
                        >
                            {typeOption.map((option) => (

                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <DateTimePicker
                            disabled
                            label="提醒开始时间"
                            value={formData.reminderTimeStart}
                            format="YYYY-MM-DD HH:mm:ss"
                            // ampm={false}

                            // onChange={handleStartDateChange}
                        // renderInput
                        // renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimePicker
                            disabled
                            label="提醒结束时间"
                            value={formData.reminderTimeEnd}
                            format="YYYY-MM-DD HH:mm:ss"
                            
                            // onChange={handleEndDateChange}
                        // renderInput
                        // renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DateTimePicker
                            disabled
                            label="创建时间"
                            value={formData.createTime}
                            format="YYYY-MM-DD HH:mm:ss"
                            
                            // onChange={handleEndDateChange}
                        // renderInput
                        // renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                                fullWidth
                                disabled
                                label="状态"
                                name="statuc"
                                value={formData.statuc===0?"待启动":formData.statuc===1?"已提醒":"已完成"}
                                // onChange={handleInputChange}
                            />
                    </Grid>
                </Grid>

                <Typography variant="subtitle2" mb={2} ml={0.5} style={{marginTop:"30px"}}>
                    描述信息
                </Typography>                
                <TextareaAutosize
                    // style={{minWidth:"00px"}}
                    // className="shadow-md"
                    // readOnly
                    disabled
                    style={{ background: "rgba(225,224,234)",minHeight:"100px",maxHeight:"150px", width: "95%", marginTop: "-3px" }}
                    minRows={3}
                    name="hdesc"
                    placeholder="描述信息"
                    value={formData.hdesc}
                />
            </form>
        </>
    )
}
// }

export default HealtyDetail