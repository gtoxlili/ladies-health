import React, {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Divider, InputAdornment, TextField, Typography} from "@mui/material";
import {DateRange, DateRangePicker} from "@mui/x-date-pickers-pro";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useDrinkRecordService} from "@service/personal";
import {callBackSnackbar} from "@lib/helper";
import {enqueueSnackbar} from "notistack";
import {useClient} from "@lib/hook";

const Water = () => {

    // 范围日期
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([dayjs().subtract(7, 'day'), dayjs()]);


    // 饮水量
    const [water, setWater] = useState('')
    // 饮水记录
    const [waterData, mutateWaterData] = useDrinkRecordService(dateRange)
    const client = useClient();

    const addWaterEntry = async () => {
        if (water === '') {
            enqueueSnackbar('饮水量不能为空', {variant: 'warning'});
            return;
        }
        const res = await client.updateDrinkRecordDao(parseFloat(water));
        if (res.data.code !== 200) {
            enqueueSnackbar(res.data.message, {variant: 'warning'})
            return
        } else {
            callBackSnackbar(res.data.data, mutateWaterData)
        }
        mutateWaterData()
        setWater('');
    }

    const calculateAverageVolume = () => {
        if (waterData.length === 0) return 0;
        const totalWater = waterData.reduce((acc, entry) => acc + entry.drinkVolume, 0);
        return (totalWater / waterData.length).toFixed(2);
    }

    const calculateAverageCount = () => {
        if (waterData.length === 0) return 0;
        const totalCount = waterData.reduce((acc, entry) => acc + entry.drinkTimes, 0);
        return (totalCount / waterData.length).toFixed(2);
    }

    return <>
        <Typography variant="subtitle2" mb={2} ml={0.5}>
            新增饮水记录
        </Typography>
        <TextField
            label="饮水量"
            type="number"
            InputProps={{
                endAdornment: <InputAdornment position="end">ml</InputAdornment>,
            }}
            value={water}
            onChange={(e) => setWater(e.target.value)}
            variant="outlined"
            sx={{mb: 2, mr: 2, width: 140}}
            size="small"
        />
        <Button variant="contained" color="primary" onClick={addWaterEntry}>
            提交
        </Button>
        <Divider/>

        <Typography variant="subtitle2" mb={1} ml={0.5} mt={1}>
            提要
        </Typography>
        <div className="flex flex-row justify-start items-center">
            <Typography variant="subtitle2" mb={1} ml={0.5} mt={1}>记录范围 ： </Typography><DateRangePicker
            localeText={{start: '开始日期', end: '结束日期'}}
            sx={{ml: 1, width: 320}}
            value={dateRange} disableFuture
            onChange={setDateRange}
        />
        </div>
        {
            waterData.length > 0 && (<>
                <Typography variant="subtitle2" mt={2} mb={2}>
                    日均饮水量：{calculateAverageVolume()} ml
                </Typography>
                <Typography variant="subtitle2" mb={2}>
                    日均饮水频率：{calculateAverageCount()} 次
                </Typography>
                <ResponsiveContainer width="80%" height={320}>
                    <LineChart
                        data={waterData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="recordTime"/>
                        <YAxis yAxisId="left"/>
                        <YAxis yAxisId="right" orientation="right" type='number'/>
                        <Tooltip/>
                        <Line yAxisId='left' type="natural" dataKey="drinkVolume" fill="#8884d8" name="饮水量"
                              animationDuration={300}/>
                        <Line yAxisId='right' type="natural" dataKey="drinkTimes" fill="#82ca9d" name="饮水次数"
                              animationDuration={300}/>
                    </LineChart>
                </ResponsiveContainer>
            </>)
        }
    </>
}


export default Water
