import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Grid, IconButton, ListItemText, MenuItem, TextareaAutosize, TextField, Typography } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import "./Comments.css"
import Discuss from "../Discuss/Discuss"
import Recommended from "../Recommended/Recommended"
import { useClient } from "@lib/hook";

// @ts-ignore
import picture from "../../static/picture.png"
// @ts-ignore
import nt from "../../static/329ccc2cdedbc10415445cb6f80c93.jpg@2x.png"
// @ts-ignore
import giveLike from "../../static/giveLike.png"
import Item from 'antd/es/list/Item';


interface Props {
    RecommendStatus: boolean;
    handleReShow: (title: string) => void;
    handleReClose: (title: string) => void;
}
const Comments: React.FC<Props> = (props) => {

    const { state } = useLocation();
    const client = useClient();

    //评论弹窗
    const [DiscussStatus, handleDiscuss] = useState(false)
    const DiscussShow = (commentId: number) => {
        handleCommentId(commentId)
        handleDiscuss(true)
    }
    const DiscussClose = () => {
        handleDiscuss(false)
    }
    const [commentId, handleCommentId] = useState(1)

    const [commentList, setCommentList] = useState(null)
    const [replyList, setReplyList] = useState(null)

    const [isReplyShow, handleReplyShow] = useState(false);

    const [allLikeList, setAllLikeList] = useState(null);

    const [likeStatus, setLikeStatus] = useState<number>(0)
    const handleLike = (is_like: number, comment_id: number) => {
        let params = {
            user_id: 1,
            comment_id: comment_id
        }
        if (is_like == 1) {
            client.cancelLike(params).then(res => {
                getData()
            })
        } else {
            client.Like(params).then(res => {
                getData()
            })
        }
    }

    const [likesList, setLikesList] = useState()

    useEffect(() => {
        getData()
    }, [state])

    const getData = () => {
        let params = {
            user_id: 1
        }
        let Redata: any;
        let Likesdata: any;
        let AllLikesList: any;
        client.getReplyList(params).then(res => {
            Redata = res.data.data;
            Redata.map((item: { release_time: string }) => {
                //格式化时间
                let dateTime = new Date(item.release_time).toLocaleString();
                item.release_time = dateTime
            })
            setReplyList(Redata)
        })
        client.LikesList(params).then(res => {
            Likesdata = res.data.data
            setLikesList(Likesdata)
        })
        client.AllLikesList(params).then(res => {
            AllLikesList = res.data.data
            setAllLikeList(AllLikesList)
        })
        client.getCommentList(params).then(res => {
            const Codata = res.data.data
            Codata.map((item: { release_time: string, reply_num: number, comment_id: number, is_like: number, realLike_num: number }) => {
                //格式化时间
                let dateTime = new Date(item.release_time).toLocaleString();
                item.release_time = dateTime

                let replyCount = 0; // 统计回复次数的变量
                let likeNum = 0; //点赞数量
                Redata.forEach((Reitem: { comment_id: number }) => {
                    if (Reitem.comment_id === item.comment_id) {
                        replyCount++; // 出现相同 comment_id 时递增回复次数
                    }
                });
                Likesdata.forEach((Litem: { comment_id: number }) => {
                    if (Litem.comment_id === item.comment_id) {
                        item.is_like = 1
                    }
                });
                AllLikesList.forEach((ALitem: { comment_id: number }) => {
                    if (ALitem.comment_id === item.comment_id) {
                        likeNum++;
                    }
                });
                item.reply_num = replyCount;
                item.realLike_num = likeNum;
            })
            setCommentList(Codata)
        })
    }

    if (commentList === null || replyList === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {commentList.map((item, index) => (
                <div key={item.comment_id} className="c1Comment">
                    <div className="character">
                        <img src={item.user_photo} alt="" />
                        <div className="message">
                            <span>{item.user_name}</span>
                            <span>{item.release_time}&nbsp;&nbsp;来自&nbsp;{item.come_from}</span>
                        </div>
                    </div>
                    <div className="article">
                        <span>{item.content}</span>
                        <span className={"c1hand"} onClick={() => props.handleReShow(item.theme_title)}>#{item.theme_title}#</span>
                        <img src={item.img} alt="" />
                    </div>
                    <div className="Action">
                        <IconButton size="small" onClick={() => handleLike(item.is_like, item.comment_id)}>
                            {
                                //判断
                                item.is_like == 1 ? <ThumbUpAltRoundedIcon sx={{ color: 'black' }} />
                                    : <ThumbUpAltOutlinedIcon sx={{ color: 'black' }} />
                            }
                        </IconButton>
                        <div className='commentbox'>{item.realLike_num}</div>
                        <div className={"c1hand commentbox"} onClick={() => DiscussShow(item.comment_id)}>评论</div>
                    </div>
                    <span className={"c1hand"} onClick={() => handleReplyShow(true)}>&nbsp;展开更多回复({item.reply_num})</span>

                    {/* 展开更多回复 */}
                    {isReplyShow && ( // 根据状态判断是否展开回复框
                        <div>
                            <div className='replyContent'>
                                {replyList.map((Reitem, Reindex) => (
                                    <div key={Reitem.reply_id}>
                                        {item.comment_id === Reitem.comment_id && (  // 根据条件渲染回复框
                                            <div className={"c1More"}>
                                                <div className={"top"}>
                                                    <img src={Reitem.user_photo} alt="" />
                                                    <div className={"nameTime"}>
                                                        <div className={"name"}>{Reitem.user_name}</div>
                                                        <div className={"time"}>{Reitem.release_time}&nbsp;&nbsp;来自&nbsp;{Reitem.come_from}</div>
                                                    </div>
                                                </div>
                                                <div className={"moreComments"}>{Reitem.reply_content}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="c1Putaway c1hand" onClick={() => handleReplyShow(false)}>收起</div>
                        </div>
                    )}
                    <Discuss Status={DiscussStatus} CommentId={commentId} handleShow={() => DiscussShow} handleClose={DiscussClose} refreshView={getData}></Discuss>
                    <Recommended Status={props.RecommendStatus} title={item.theme_title} handleShow={() => props.handleReShow} handleClose={() => props.handleReClose}></Recommended>
                </div>
            ))}
        </div>
    )
}

export default Comments

