import React, {useState} from 'react';
import {Button, Divider, InputAdornment, TextField, Typography} from '@mui/material';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {DateRange, DateRangePicker} from "@mui/x-date-pickers-pro";
import dayjs, {Dayjs} from "dayjs";
import {enqueueSnackbar} from "notistack";
import {useSleepRecordService} from "@service/personal";
import {useClient} from "@lib/hook";
import {callBackSnackbar} from "@lib/helper";

const SleepTracker = () => {

    // 范围日期
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([dayjs().subtract(7, 'day'), dayjs()]);

    const [sleepData, mutateSleepData] = useSleepRecordService(dateRange)
    const [sleepHours, setSleepHours] = useState('');

    const client = useClient();

    const addSleepEntry = async () => {
        if (sleepHours === '') {
            enqueueSnackbar('睡眠时长不得为空', {variant: 'warning'});
            return;
        }
        const res = await client.updateSleepRecordDao(parseFloat(sleepHours));
        if (res.data.code !== 200) {
            enqueueSnackbar(res.data.message, {variant: 'warning'})
            return
        } else {
            callBackSnackbar(res.data.data, mutateSleepData)
        }
        mutateSleepData()
        setSleepHours('');
    };

    const calculateAverageSleep = () => {
        if (sleepData.length === 0) return 0;
        const totalHours = sleepData.reduce((acc, entry) => acc + entry.sleepTime, 0);
        return (totalHours / sleepData.length).toFixed(2);
    };

    return <>
        <Typography variant="subtitle2" mb={2} ml={0.5}>
            睡眠记录录入
        </Typography>
        <TextField
            label="睡眠时长"
            type="number"
            InputProps={{
                endAdornment: <InputAdornment position="end">h</InputAdornment>,
            }}
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            variant="outlined"
            sx={{mb: 2, mr: 2, width: 140}}
            size="small"
        />
        <Button variant="contained" color="primary" onClick={addSleepEntry}>
            提交
        </Button>
        <Divider/>

        <Typography variant="subtitle2" mb={1} ml={0.5} mt={1}>
            提要
        </Typography>
        <div className="flex flex-row justify-start items-center">
            <Typography variant="subtitle2" mb={1} ml={0.5} mt={1}>记录范围 ：
            </Typography>
            <DateRangePicker
                localeText={{start: '开始日期', end: '结束日期'}}
                sx={{ml: 1, width: 320}}
                value={dateRange}
                onChange={setDateRange}
                disableFuture
            />
        </div>
        {
            sleepData.length > 0 && (<>
                    <Typography variant="subtitle2" mt={2} mb={2}>
                        平均睡眠时长：{calculateAverageSleep()} 小时
                    </Typography>
                    <ResponsiveContainer width="80%" height={320}>
                        <LineChart
                            data={sleepData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="recordTime"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="natural" dataKey="sleepTime" fill="#8884d8" name="睡眠时长"
                                  animationDuration={300}/>
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )
        }
    </>
};

export default SleepTracker;
