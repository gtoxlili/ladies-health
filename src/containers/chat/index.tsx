// 智能问诊框
import {Avatar, Badge, CircularProgress, IconButton, styled, TextField} from "@mui/material";

// @ts-ignore
import bot from "@assets/bot.webp";
// @ts-ignore
import user from "@assets/user.webp";

import SendIcon from "@mui/icons-material/Send";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useInquiryReader, useInquiryRecordsService} from "@service/inquiry";
import {useClient} from "@lib/hook";
import {enqueueSnackbar} from "notistack";

const StyledBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const ChatItem = (
    props: {
        role: 'assistant' | 'user',
        content: string, loading?: boolean
    }
) => {
    const {role, content, loading} = props

    return role === 'assistant' ?
        <div className='flex'>
            <div className='pr-4'>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    variant="dot"
                >
                    <Avatar alt="Bot" src={bot}/>
                </StyledBadge>
            </div>
            <div className='px-4 py-2 rounded-xl bg-[#f1f2f2] break-words whitespace-pre-wrap'>
                {content}
            </div>
        </div> : <div className='flex flex-row-reverse'>
            <div className='pl-4'>
                <Avatar alt="User" src={user}/>
            </div>
            <div className='px-4 py-2 rounded-xl bg-[#5d5cde] text-white break-words whitespace-pre-wrap'>
                {content}
            </div>
        </div>
}

const ChatParseItem = () => {
    return <div className='flex'>
        <div className='pr-4'>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                variant="dot"
            >
                <Avatar alt="Bot" src={bot}/>
            </StyledBadge>
        </div>
        <div
            className='px-2 py-2 break-words whitespace-pre-wrap text-sm font-medium flex items-center gap-2 font-sans'>
            <CircularProgress size={18} thickness={6} color='success'/>
            正在生成体征报表以及抽取相关疾病信息...
        </div>
    </div>
}


const ChatWaitingItem = (
    props: {
        topicId: string
        onEnd: () => void
    }
) => {
    const {topicId, onEnd} = props
    const resultText = useInquiryReader(topicId, str => str, onEnd)
    return <div className='flex'>
        <div className='pr-4'>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                variant="dot"
            >
                <Avatar alt="Bot" src={bot}/>
            </StyledBadge>
        </div>
        <div className='px-4 py-2 rounded-xl bg-[#f1f2f2] break-words whitespace-pre-wrap'>
            {resultText}
        </div>
    </div>
}

const Chat = (
    props: {
        topicId?: string
        setTopicId: (id: string) => void
    }
) => {

    const {topicId, setTopicId} = props

    // 输入框
    const [input, setInput] = useState('')

    const endRef = useRef<HTMLDivElement>(null)

    const [chatRecord, mutateChatRecord] = useInquiryRecordsService(topicId)

    const client = useClient()
    // 是否处于等待消息的状态 三个状态 无等待 | 等待解析 | 等待回复
    const [waiting, setWaiting] = useState<'none' | 'register' | 'parsing' | 'waiting'>('none')

    useEffect(() => endRef.current?.scrollIntoView({
        behavior: "smooth"
    }), [chatRecord, waiting]);

    const onSend = useCallback(async () => {
        if (waiting != 'none' || input.trim() === '') return

        await mutateChatRecord(prev => [...prev!, {
            role: 'user',
            message: input
        }], false)

        if (topicId) {
            setWaiting('register')
        } else {
            setWaiting('parsing')
        }

        const text = input
        setInput('')

        const res = await client.registerInquiryDao(text, topicId)
        if (res.data.code === 200) {
            if (!topicId) {
                setTopicId(res.data.data)
            }
            setWaiting('waiting')
        } else {
            enqueueSnackbar(res.data.message, {variant: 'warning'})
            await mutateChatRecord(prev => prev!.slice(0, prev!.length - 1), false)
            setWaiting('none')
        }

    }, [input, waiting])

    return <div className='bg-neutral-50/60 shadow-md rounded-md w-full p-4 flex flex-col pt-6'>
        <div className="text-xl font-medium text-rose-800 mb-6">智能问诊</div>
        <div className='flex-1 flex flex-col gap-4 overflow-y-auto pb-4 -mr-3 pr-3'>
            <ChatItem
                role="assistant"
                content="您好，我是智能问诊机器人，很高兴为您服务！"
            />
            {
                chatRecord.map((item, index) => {
                    return <ChatItem
                        key={index}
                        role={item.role}
                        content={item.message}
                    />
                })
            }
            {waiting === 'waiting' && <ChatWaitingItem topicId={topicId!} onEnd={
                () => {
                    mutateChatRecord()
                    setWaiting('none')
                }}/>}
            {waiting === 'parsing' && <ChatParseItem/>}
            <div ref={endRef}/>
        </div>
        <TextField
            multiline
            fullWidth
            size='small'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxRows={4}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    if (e.shiftKey) return
                    onSend()
                    e.preventDefault();
                }
            }}
            InputProps={{
                endAdornment:
                    <IconButton
                        size='small'
                        sx={{
                            alignSelf: 'flex-end',
                        }}
                        onClick={onSend}
                    >
                        {
                            waiting === 'none' ? <SendIcon fontSize="small"/> :
                                <CircularProgress size={20} thickness={6}/>
                        }
                    </IconButton>,
            }}
        />
    </div>
}
export default Chat
