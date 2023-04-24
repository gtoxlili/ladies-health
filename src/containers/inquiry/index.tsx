import React, {useState} from "react";
import {IconButton, Paper} from '@mui/material';
import classnames from "classnames";
// @ts-ignore
import bot from "@assets/bot.webp";
// @ts-ignore
import user from "@assets/user.webp";
import Chat from "@containers/chat";
import RelatedDisease from "@containers/chat/component/disease";
import CloseIcon from '@mui/icons-material/Close';
import {useTopicsService} from "@service/inquiry";
import {useClient} from "@lib/hook";
import {enqueueSnackbar} from "notistack";
import {callBackSnackbar} from "@lib/helper";


const Inquiry = () => {
    const [topicId, setTopicId] = useState<string | undefined>()

    const [topics, mutateTopics] = useTopicsService()

    const client = useClient()

    const deleteTopic = async (id: string) => {
        const res = await client.deleteTopicDao(id)
        if (res.data.code !== 200) {
            enqueueSnackbar(res.data.message, {variant: 'warning'})
            return
        } else {
            callBackSnackbar(res.data.data, mutateTopics)
        }
        await mutateTopics()
        if (id === topicId) {
            setTopicId(undefined)
        }
    }

    return <div
        className='flex gap-8 h-full'
    >
        <div className='space-y-8 shrink-0 w-[360px] h-full flex flex-col'>
            <div className={
                classnames('bg-neutral-50/60 shadow-md rounded-md py-6 pl-4 pr-1 flex flex-col transition-all', {
                    'h-2/3': topicId, 'h-full': !topicId
                })
            }>
                <div className="text-xl font-medium text-rose-800 mb-6">问诊记录</div>
                <div className='overflow-y-auto space-y-2 h-full pr-3'>
                    {
                        topics.map((topic) => {
                            return <Paper
                                key={topic.topicId}
                                sx={{
                                    py: "7px", px: "16px"
                                }}
                                className='flex items-center select-none cursor-pointer'
                                onClick={() => setTopicId(topic.topicId)}
                            >
                                <div className={
                                    classnames('flex-1', {
                                        'text-rose-800': topicId === topic.topicId,
                                    })
                                }>{topic.title}</div>
                                <IconButton
                                    size='small'
                                    onClick={(e) => {
                                        deleteTopic(topic.topicId)
                                        // 阻止事件冒泡
                                        e.stopPropagation()
                                    }}
                                >
                                    <CloseIcon/>
                                </IconButton>
                            </Paper>
                        })
                    }
                </div>
            </div>
            <RelatedDisease topicId={topicId}/>
        </div>
        <Chat topicId={topicId} setTopicId={setTopicId}/>
    </div>
}

export default Inquiry
