import { Button, Modal, Input} from 'antd';
import React, { useState } from 'react';
import "./Message.css"

// @ts-ignore
import picture from "../../static/picture.png"

const Recommended:React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false );
    };

    const { TextArea } = Input;
    return (
        <div className='xzcMessage'>
            <Button type="primary" onClick={showModal}>
                消息通知
            </Button>
            <Modal

                className="c2Modal"
                footer={null}
                okText="确定" cancelText="取消" title="消息通知" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="c3line"></div>
                <div className="c4giveaLike">
                    <div className="content">
                        <img src={picture} alt=""/>
                        <span>vouzme点赞了您的帖子</span>
                        <div>诶呦不错哦</div>
                    </div>
                    <div>
                        有没有什么女性水电费萨芬撒旦法师打发水电费尴尬示范岗撒法规和友好医院
                    </div>
                </div>
                <div className="c2footerBtn">
                    <div>
                        <Button>取消</Button>
                        <Button style={{marginLeft: "10px"}}  type="primary">确认</Button>
                    </div>

                </div>
            </Modal>
        </div>
    );
};
export default Recommended;
