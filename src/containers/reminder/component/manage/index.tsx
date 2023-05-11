import {Button ,Typography} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import PaginationTable  from '../../PaginationTable';


const HealthyManage = () => {
    const navigate = useNavigate()

    const toAdd =()=>{
        navigate("/helathy/add",{state:{type:"add"}})
    }
    
    const [key,setKey] = useState(Math.random())

    return <>
        <div style={{marginBottom:"5px"}}>
            {/* <Button type="button"  className="mui-btn mui-btn-primary" onClick={()=>{toAdd(hy>
)}}>新增健康提醒</Button> */}

            <Typography variant="subtitle2" style={{width:"50%",marginLeft:"45%"}}>
                <b>提醒管理</b>
            </Typography>
            <Button variant="contained" color="primary" onClick={toAdd} sx={{width: 120}}>
                新增健康提醒
            </Button>
            <Button style={{marginLeft:"10px"}} variant="contained" color="info" onClick={() =>{setKey(key+1)}} sx={{width: 100}}>
                刷新列表
            </Button>
        </div>
        <div className='flex' style={{width:"98%",marginTop:"15px"}}>
            <PaginationTable statuc={0} key={key} />
        </div>
    </>


}

export default HealthyManage