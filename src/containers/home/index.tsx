import React, {useState} from "react";
import {Alert} from '@mui/material';
import classnames from "classnames";
// @ts-ignore
import bot from "@assets/bot.webp";
// @ts-ignore
import user from "@assets/user.webp";
import Chat from "@containers/chat";
import RelatedDisease from "@containers/chat/component/disease";

const InformationColumn = (
    props: {
        topicId?: string
    }
) => {
    const {topicId} = props

    return <div className='space-y-8 shrink-0 w-[360px] h-full flex flex-col'>
        <div className={
            classnames('bg-neutral-50/60 shadow-md rounded-md py-6 pl-4 pr-1 flex flex-col transition-all', {
                'h-80': topicId, 'h-full': !topicId
            })
        }>
            <div className="text-xl font-medium text-rose-800 mb-6">提醒事项</div>
            <div className='overflow-y-auto space-y-2 h-full pr-3'>
                <Alert severity="info">距离下次月经预计还有 3 天</Alert>
                <Alert severity="error">近 7 日平均睡眠时长低于预警线</Alert>
                <Alert severity="warning">今日还未开始运动</Alert>
            </div>
        </div>
        <RelatedDisease topicId={topicId}/>
    </div>
}


const Home = () => {
    const [topicId, setTopicId] = useState<string | undefined>()

    return <div
        className='flex gap-8 h-full'
    >
        <InformationColumn topicId={topicId}/>
        <Chat topicId={topicId} setTopicId={setTopicId}/>
    </div>
}

export default Home
