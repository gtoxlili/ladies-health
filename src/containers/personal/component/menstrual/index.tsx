import {Button, Checkbox, Divider, FormControlLabel, Rating, Typography} from "@mui/material";
import React, {useState} from "react";
import {DateRange, DateRangeCalendar, DateRangePicker} from "@mui/x-date-pickers-pro";
import dayjs, {Dayjs} from "dayjs";
import {useImmer} from "use-immer";
import OpacityIcon from '@mui/icons-material/Opacity';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import {pink} from "@mui/material/colors";
import {
    MenstruationRecord,
    MenstruationVO,
    useMenstruationRecordService,
    usePredictMenstruationService
} from "@service/personal";
import {useClient} from "@lib/hook";
import {enqueueSnackbar} from "notistack";
import {callBackSnackbar, colorFromHash} from "@lib/helper";
import {KeyedMutator} from "swr";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

// 新增记录
const AddRecord = (
    props: {
        mutatePredictRange: KeyedMutator<DateRange<Dayjs>>
        mutateRecordData: KeyedMutator<MenstruationVO>
    }
) => {

    // 月经开始时间
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([dayjs().subtract(7, 'day'), dayjs()]);

    /*
    流量 ： 1 - 5
    疼痛 ： 1 - 5
    便秘 ： true / false
    恶心 ： true / false
    发冷 ： true / false
    膀胱失禁 ： true / false
    潮热 ： true / false
     */

    const [menstrual, setMenstrual] = useImmer<MenstruationRecord>({
        flow: 1,
        pain: 1,
        constipation: false,
        nausea: false,
        cold: false,
        incontinence: false,
        hot: false,
    })

    // 新增记录
    const client = useClient()
    const addRecord = async () => {
        if (!dateRange.at(0)!.isValid() || !dateRange.at(1)!.isValid()) {
            enqueueSnackbar('请选择月经开始时间', {variant: 'warning'})
        }
        const res = await client.addMenstruationRecordDao({
            ...menstrual,
            startTime: dateRange[0]!.format('YYYY-MM-DD'),
            endTime: dateRange[1]!.format('YYYY-MM-DD'),
        })
        if (res.data.code !== 200) {
            enqueueSnackbar(res.data.message, {variant: 'warning'})
            return
        } else {
            callBackSnackbar(res.data.data, props.mutatePredictRange)
        }
        props.mutatePredictRange()
        props.mutateRecordData()
        setMenstrual(draft => {
            draft.flow = 1
            draft.pain = 1
            draft.constipation = false
            draft.nausea = false
            draft.cold = false
            draft.incontinence = false
            draft.hot = false
        })
    }

    return <div className='grid grid-cols-4 gap-4 items-center w-[460px]'>
        <Typography variant="subtitle2">
            月经周期
        </Typography>
        <div className='col-span-3 mr-14'>
            <DateRangePicker
                localeText={{start: '开始日期', end: '结束日期'}}
                value={dateRange}
                onChange={setDateRange}
                disableFuture
            />
        </div>
        <Typography variant="subtitle2">
            月经反应
        </Typography>
        <div className='grid grid-cols-3 gap-1 col-span-3 items-center pt-4'>
            <Typography variant="subtitle2">
                流量
            </Typography>

            <div className='col-span-2 justify-self-center'>
                <Rating
                    precision={0.5}
                    // 红色
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: '#ff6d75',
                        },
                        '& .MuiRating-iconHover': {
                            color: '#ff3d47',
                        },
                    }}
                    icon={<OpacityIcon fontSize="inherit"/>}
                    emptyIcon={<OpacityIcon fontSize="inherit"/>}
                    value={menstrual.flow}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.flow = nv as number
                        })
                    }}
                />
            </div>

            <Typography variant="subtitle2">
                疼痛
            </Typography>
            <div className='col-span-2 justify-self-center'>
                <Rating
                    precision={0.5}
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: '#FF5733',
                        },
                        '& .MuiRating-iconHover': {
                            color: '#FF8C5A',
                        },
                    }}
                    icon={<SentimentVeryDissatisfiedIcon fontSize="inherit"/>}
                    emptyIcon={<SentimentVeryDissatisfiedIcon fontSize="inherit"/>}
                    value={menstrual.pain}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.pain = nv as number
                        })
                    }}
                />
            </div>
            <FormControlLabel
                control={<Checkbox
                    checked={menstrual.constipation}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.constipation = nv
                        })
                    }}
                    size='small' sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                        color: pink[600],
                    },
                }}/>}
                label={<span className='text-sm'>便秘</span>}/>
            <FormControlLabel
                control={<Checkbox
                    checked={menstrual.nausea}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.nausea = nv
                        })
                    }}
                    size='small' sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                        color: pink[600],
                    },
                }}/>}
                label={<span className='text-sm'>恶心</span>}/>
            <FormControlLabel
                control={<Checkbox
                    checked={menstrual.cold}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.cold = nv
                        })
                    }}
                    size='small' sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                        color: pink[600],
                    },
                }}/>}
                label={<span className='text-sm'>发冷</span>}/>
            <FormControlLabel
                control={<Checkbox
                    checked={menstrual.incontinence}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.incontinence = nv
                        })
                    }}
                    size='small' sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                        color: pink[600],
                    },
                }}/>}
                label={<span className='text-sm'>膀胱失禁</span>}/>
            <FormControlLabel
                control={<Checkbox
                    checked={menstrual.hot}
                    onChange={(_, nv) => {
                        setMenstrual(draft => {
                            draft.hot = nv
                        })
                    }}
                    size='small' sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                        color: pink[600],
                    },
                }}/>}
                label={<span className='text-sm'>潮热</span>}/>
        </div>
        <div className='col-start-4'>
            <Button variant="contained" color="primary" onClick={addRecord} sx={{width: 64}}>
                提交
            </Button>
        </div>
    </div>
}

// 预测周期
const Predict = (
    props: {
        predictRange: DateRange<Dayjs>
    }
) => {

    return <div className="flex flex-row items-center pt-4">
        <Typography variant="subtitle2">
            预计下次月经周期
        </Typography>
        <div className='ml-4'>
            <DateRangeCalendar
                calendars={1}
                readOnly
                disableHighlightToday
                value={props.predictRange}
            />
        </div>
    </div>
}

const Menstrual = () => {

    const [predictRange, mutatePredictRange] = usePredictMenstruationService()
    const [recordData, mutateRecordData] = useMenstruationRecordService()

    return <>
        <div className='flex'>
            <div>
                <AddRecord mutatePredictRange={mutatePredictRange} mutateRecordData={mutateRecordData}/>
                <Divider sx={{
                    py: 2, width: '90%'
                }}/>
                <Predict predictRange={predictRange}/>
            </div>
            <Divider orientation="vertical" flexItem/>
            <div className='flex flex-col items-center justify-between w-full px-6'>
                <Typography variant="subtitle2">
                    过去一年内月经周期
                </Typography>
                <ResponsiveContainer width="80%" height="40%" minWidth={320}>
                    <BarChart
                        data={recordData.days}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="key"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar
                            dataKey='value'
                            animationDuration={300}
                            maxBarSize={30}
                            name="月经天数"
                        >
                            {recordData.days.map((entry, index) => {
                                return <Cell key={`cell-${index}`} fill={colorFromHash(entry.key)}/>
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <Typography variant="subtitle2">
                    过去一年内各项症状频率
                </Typography>

                <ResponsiveContainer width="60%" height="40%" minWidth={320}>
                    <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            data={recordData.reactions}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            fill="#8884d8"
                            label
                            nameKey='key'
                            animationDuration={300}
                        >
                            {recordData.reactions.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colorFromHash(entry.key)}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </>


}

export default Menstrual
