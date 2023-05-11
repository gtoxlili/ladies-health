import {Button, Input, Modal} from 'antd';
import React, {useState} from 'react';
import "./Discuss.css"

// @ts-ignore
import smilingFace from "../../static/smilingFace.png"
// @ts-ignore
import Image from "../../static/Image.png"


const Discuss: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const {TextArea} = Input;
    return (
        <div className='Discuss'>
            <Button type="primary" onClick={showModal}>
                立即评论
            </Button>
            <Modal
                className="c2Modal"
                footer={null}
                okText="确定" cancelText="取消" title="评论" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <TextArea rows={4} placeholder="说说你想说的话" maxLength={6}/>
                <div className="c2footerBtn">
                    <div>
                        <Button>取消</Button>
                        <Button style={{marginLeft: "10px"}} type="primary">确认</Button>
                    </div>
                    <div>
                        <img src={smilingFace} alt=""/>
                        <img src={Image} alt=""/>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Discuss;
