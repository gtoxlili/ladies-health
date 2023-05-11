import React, { useEffect, useState } from "react";

import { Grid, TextField, TextareaAutosize, Button, IconButton, MenuItem, Typography } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { DateTimePicker } from '@mui/x-date-pickers-pro';
import './healthy.css'
import {HealtyPoProps} from './healthyProps'
import {enqueueSnackbar} from "notistack";
import {useClient} from "@lib/hook";
import {useNavigate} from "react-router-dom";

function HealtyAdd() {

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
        hdesc:""
    });

    useEffect(()=>{
        if(state.type ==="edit"){
            let fid= state.fid;
            client.getHealthyDetail(fid).then(res =>{
                let code =res.data.code;
                if(code ===200){
                    let data =res.data.data;
                    let reminderTimeEnd= dayjs(data.reminderTimeEnd);
                    let reminderTimeStart=dayjs(data.reminderTimeStart)

                    setFormData({
                        ...data, reminderTimeEnd,reminderTimeStart
                    })
                }
            })
        }
    },[state])


    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(formData);
        // 检验提醒开始和结束时间是否符合要求
        if(!formData.reminderTimeStart ||  !formData.reminderTimeEnd){
            enqueueSnackbar('提醒时间不允许为空!', {variant: 'error'})
            return ;
        }
        let endTime = dayjs(formData.reminderTimeEnd);
        let startTime = dayjs(formData.reminderTimeStart);

        if(!endTime.isValid() || !endTime.isValid()){
            enqueueSnackbar('提醒时间输入有误!', {variant: 'error'})
            return
        }
        if(endTime.isBefore(startTime) || endTime.isSame(startTime) ){
            enqueueSnackbar('提醒结束时间不允许早于或等于开始时间!', {variant: 'error'})
            return ;
        }

        if(state.type ==="add"){
            client.saveHealthy(formData).then(res =>{
                let code =res.data.code ;
                if(code === 200){
                    enqueueSnackbar('新增成功!', {variant: 'success'})
                    navigate("/helathy")
                }else{
                    enqueueSnackbar('新增失败!', {variant: 'error'})
                }
            })
        }else{
            // debugger;
            // return
            let { type, hdesc, reminderTimeEnd,reminderTimeStart, fid } = formData;
            let param ={
                fid,type,hdesc,
                reminderTimeEnd: dayjs(reminderTimeEnd.$d).format('YYYY-MM-DD HH:mm:ss'),
                reminderTimeStart: dayjs(reminderTimeStart.$d).format('YYYY-MM-DD HH:mm:ss')
            };

            client.updateHealthy(param).then(res =>{
                let code =res.data.code ;
                if(code === 200){
                    enqueueSnackbar('编辑成功!', {variant: 'success'})
                    navigate("/helathy")
                }else{
                    enqueueSnackbar(`${res.data.message}`, {variant: 'error'})
                    setTimeout(()=>{
                        navigate("/helathy")
                    }, 1000)
                }
                
            })
        }

    };

    const handleStartDateChange = (date: any ) => {
        setFormData({...formData, reminderTimeStart: dayjs(date.$d).format('YYYY-MM-DD HH:mm:ss')})
    };
    const handleEndDateChange = (date: any ) => {
        setFormData({...formData, reminderTimeEnd: dayjs(date.$d).format('YYYY-MM-DD HH:mm:ss')})
    };

    return (
        <>
            <Typography variant="subtitle2" mb={2} ml={0.5}>
                <IconButton size="small" onClick={()=>navigate(-1)}>
                    <ArrowBackIcon  sx={{
                            color: 'black',
                        }} />
                </IconButton>
                <span style={{ fontSize: "16px" }}><b> {state.type==="add"?"新增提醒":"编辑提醒"}</b></span>
            </Typography>

            <form onSubmit={handleSubmit} style={{ marginTop: "55px" }} >

                <Typography variant="subtitle2" mb={2} ml={0.5}>
                    
                    {state.type==="add"?"提醒信息录入":"提醒信息修改"}
                </Typography>

                <Grid container spacing={2} >
                    <Grid item xs={6}>
                        <TextField 
                            required
                            fullWidth
                            disabled={state.type=="edit"}
                            label="主题"
                            name="theme"
                            value={formData.theme}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            required
                            fullWidth
                            label="提醒方式"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
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
                            
                            label="提醒开始时间"
                            value={formData.reminderTimeStart}
                            format="YYYY-MM-DD HH:mm:ss"
                            // ampm={false}

                            onChange={handleStartDateChange}
                        // renderInput
                        // renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimePicker
                            label="提醒结束时间"
                            value={formData.reminderTimeEnd}
                            format="YYYY-MM-DD HH:mm:ss"
                            
                            onChange={handleEndDateChange}
                        // renderInput
                        // renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>

                </Grid>

                <Typography variant="subtitle2" mb={2} ml={0.5} style={{marginTop:"30px"}}>
                    
                    {state.type==="add"?"描述信息录入":"描述信息修改"}
                </Typography>                
                <TextareaAutosize
                    // style={{minWidth:"00px"}}
                    // className="shadow-md"
                    style={{ background: "rgba(225,224,234)",minHeight:"100px",maxHeight:"150px", width: "95%", marginTop: "-3px" }}
                    minRows={3}
                    name="hdesc"
                    placeholder="描述信息"
                    value={formData.hdesc}
                    onChange={handleInputChange}
                />
                <Grid item xs={12} style={{marginTop:"10px"}}>
                    <Button type="submit" variant="contained" color="primary">
                        提交
                    </Button>
                </Grid>
            </form>
        </>
    )
}
// }

export default HealtyAdd