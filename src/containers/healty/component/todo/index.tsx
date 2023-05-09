import React, {useState} from "react";

import PaginationTable  from '../../PaginationTable';
import { Typography,Button} from "@mui/material";

const HealthyManageTodo = () => {

    const[key,setKey] =useState(0)

    return <>
        <div style={{marginBottom:"5px"}}>
            {/* <Button type="button"  className="mui-btn mui-btn-primary" onClick={()=>{toAdd()}}>新增健康提醒</Button> */}

            <Typography variant="subtitle2" style={{width:"50%",marginLeft:"45%"}}>
                <b>我的待办</b>
            </Typography>

            <Button style={{marginLeft:"10px"}} variant="contained" color="info" onClick={() =>{setKey(key+1)}} sx={{width: 100}}>
                刷新列表
            </Button>

        </div>
        <div className='flex' style={{width:"98%",marginTop:"15px"}}>
            <PaginationTable statuc={1} key={key}/>
        </div>
    </>


}

export default HealthyManageTodo
