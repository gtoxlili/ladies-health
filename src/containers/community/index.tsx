import Comments from "./components/Comments/Comments";
import Recommended from "./components/Recommended/Recommended"
import Involved from "./components/Involved/Involved"
import Message from "./components/Message/Message";
import Discuss from "./components/Discuss/Discuss";
import "./community.css"

// @ts-ignore
import chatting from "./static/Chatting.png"
// @ts-ignore
import board from "./static/board.png"
// @ts-ignore
import combined from "./static/Combined Shape@2x.png"

// @ts-ignore
import email from "./static/email.png"
import React from "react";

function Community() {
    return (
        <div className='bg-neutral-50/60 shadow-md rounded-md relative h-full'>
            <div className='absolute top-0 left-0 bottom-0 right-0 p-8 w-full overflow-auto '>
                <div className="c5Community">
                    <div className="c5title">
                        <div>创作中心</div>
                        <div>更多</div>
                    </div>
                    <div className="c5Card">
                        <div className="Nearby">
                            <div className="left">
                                <div>
                                    <img src={chatting} alt=""/>
                                </div>
                                <div>
                                    <div className="top">附近女生拍了拍你</div>
                                    <div className="c3bottom">同城医疗结构等你推荐</div>
                                </div>

                            </div>
                            <div className="right">
                                <div className="c1hand">立即推荐</div>
                            </div>
                        </div>
                        <div className="Nearby">
                            <div className="left">
                                <div>
                                    <img src={board} alt=""/>
                                </div>
                                <div>
                                    <div className="top">全民美食大 "晒"</div>
                                    <div className="c3bottom">晒美食，秀厨艺～</div>
                                </div>

                            </div>
                            <div className="right">
                                <div className="c1hand">去参与</div>
                            </div>
                        </div>
                    </div>


                    {/* 评论 start*/}
                    <Comments></Comments>
                    {/* end*/}
                    <div className="c5Additional">
                        <div>
                            <img src={combined} alt=""/>
                        </div>
                        <div>
                            <img src={email} alt=""/>
                        </div>
                    </div>

                    <Recommended></Recommended>
                    <Involved></Involved>
                    <Message></Message>
                    <Discuss></Discuss>
                </div>
            </div>
        </div>

    );
}

export default Community;
