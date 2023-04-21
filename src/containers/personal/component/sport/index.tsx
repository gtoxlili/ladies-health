import React, {useMemo, useState} from 'react';
import TextField from '@mui/material/TextField';
import {Autocomplete, Button, CircularProgress, Divider, InputAdornment, Typography} from "@mui/material";
import {callBackSnackbar} from "@lib/helper";
import {DateRange, DateRangePicker} from "@mui/x-date-pickers-pro";
import dayjs, {Dayjs} from "dayjs";
import {ExerciseRecord, useExerciseRecordService, useExerciseType} from "@service/personal";
import {useImmer} from "use-immer";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {enqueueSnackbar} from "notistack";
import {useClient} from "@lib/hook";


const Sport = () => {

    // 范围日期
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([dayjs().subtract(7, 'day'), dayjs()]);
    const [sport, setSport] = useImmer<ExerciseRecord>({})
    const [sportData, mutateSportData] = useExerciseRecordService(dateRange)

    const [exerciseTypes, addTypes, loading] = useExerciseType()
    const client = useClient();

    const addSportEntry = async () => {
        if (!sport.exerciseType) {
            enqueueSnackbar('运动类型不能为空', {variant: 'warning'});
            return;
        }
        if (!sport.exerciseDuration) {
            enqueueSnackbar('运动时长不能为空', {variant: 'warning'});
            return;
        }
        const res = await client.updateExerciseRecordDao(sport.exerciseType, sport.exerciseDuration);
        if (res.data.code !== 200) {
            enqueueSnackbar(res.data.message, {variant: 'warning'})
            return
        } else {
            callBackSnackbar(res.data.data, mutateSportData)
        }
        mutateSportData()
        addTypes(sport.exerciseType)
        setSport(draft => {
            draft.exerciseType = ''
            draft.exerciseDuration = 0
        })
    }

    const averageSport = useMemo(
        () => {
            if (sportData.length === 0) return 0;
            const totalHours = sportData.reduce((acc, entry) => {
                // 将 Entry ：Record<string, string> 所有 value 加起来,另外 排除 key 为 recordTime 的一项
                return acc + Object.values(entry).filter(value => value !== entry['recordTime']).reduce((acc, value) => acc + parseFloat(value), 0)
            }, 0);
            return (totalHours / sportData.length).toFixed(2)
        }
        , [sportData])


    return <>
        <Typography variant="subtitle2" mb={2} ml={0.5}>
            新增运动记录
        </Typography>
        <div className='grid
        grid-cols-3
        gap-x-8 gap-y-2'>
            <Autocomplete
                loading={loading}
                freeSolo
                disablePortal
                options={exerciseTypes}
                size="small"
                inputValue={sport.exerciseType || ''}
                onInputChange={(_, niv) => {
                    setSport(draft => {
                        draft.exerciseType = niv
                    })
                }}
                renderInput={(params) =>
                    <TextField {...params} label="运动类型"
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <>
                                           {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                           {params.InputProps.endAdornment}
                                       </>
                                   ),
                               }}
                    />
                }
            />
            <TextField
                label="运动时长"
                type="number"
                value={sport.exerciseDuration || ''}
                onChange={e => {
                    setSport(draft => {
                        draft.exerciseDuration = parseFloat(e.target.value)
                    })
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
                size="small"
            />
            <Button variant="contained" color="primary" onClick={addSportEntry} sx={{width: 64}}>
                提交
            </Button>
        </div>
        <Divider sx={{my: 2}}/>

        <Typography variant="subtitle2" mb={1} ml={0.5} mt={1}>
            提要
        </Typography>
        <div className="flex flex-row justify-start items-center">
            <Typography variant="subtitle2" mb={1} ml={0.5} mt={1}>记录范围 ： </Typography>
            <DateRangePicker
                localeText={{start: '开始日期', end: '结束日期'}}
                sx={{ml: 1, width: 320}}
                value={dateRange}
                onChange={setDateRange}
                disableFuture
            />
        </div>
        {
            sportData.length > 0 && (<>
                <Typography variant="subtitle2" mt={2} mb={2}>
                    日均运动量：{averageSport} h
                </Typography>
                <ResponsiveContainer width="80%" height={320}>
                    <BarChart
                        data={sportData}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="recordTime"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        {
                            exerciseTypes.map((type, _) => {
                                return <Bar
                                    dataKey={type.label}
                                    stackId='exercise'
                                    key={type.label}
                                    fill={type.color}
                                    animationDuration={300}
                                    maxBarSize={30}
                                />
                            })
                        }
                    </BarChart>
                </ResponsiveContainer>
            </>)
        }

    </>
};


export default Sport
