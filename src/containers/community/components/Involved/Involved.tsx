import { Button, Modal, Input} from 'antd';
import React, { useState } from 'react';
import "./Involved.css"

// @ts-ignore
import nmt from "../../static/b0221e047045b8c355a7fa3567f5428b.jpeg@3x.png"
// @ts-ignore
import Degree from "../../static/Degree.png"

const Involved:React.FC = () => {
    const {Search} = Input
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
        <div className='Involved'>
            <Button type="primary" onClick={showModal}>
                去参与
            </Button>
            <Modal
                className="c2Modal"
                footer={null}
                closable={false}
                okText="确定" cancelText="取消"  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="搜索您感兴趣的话题" bordered={false}/>
                <div className="c3line"></div>
                <div className="c3list">
                    <div className="content">
                        <img src={nmt} alt=""/>
                        <div>
                            <span className="text">#生育登记取消结婚限制#</span>
                            <div>
                                <img src={Degree} alt=""/>
                                <span>热度5.4w</span>
                            </div>
                            <span className="c3bottom">2988网友热议中</span>
                        </div>
                    </div>
                    <Button className="c3btn">立即参与</Button>
                </div>


                <div className="c2footerBtn">
                    <div>
                        <Button>取消</Button>
                        <Button style={{marginLeft: "10px"}}  type="primary">确定</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Involved;
