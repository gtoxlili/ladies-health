import {Button, Input, Modal} from 'antd';
import React, {useState} from 'react';
import "./Recommended.css"


// @ts-ignore
import nmt from "../../static/b0221e047045b8c355a7fa3567f5428b.jpeg@3x.png"
// @ts-ignore
import Degree from "../../static/Degree.png"

const Recommended: React.FC = () => {
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
        <div className='zxcRecommended'>
            <Button type="primary" onClick={showModal}>
                立即推荐
            </Button>
            <Modal

                className="c2Modal"
                footer={null}
                okText="确定" cancelText="取消" title="附近女生拍了拍你" open={isModalOpen} onOk={handleOk}
                onCancel={handleCancel}>
                <TextArea rows={4} placeholder="说说你想说的话" maxLength={6}/>
                <div className="c2footerBtn">
                    <div>
                        <Button>取消</Button>
                        <Button style={{marginLeft: "10px"}} type="primary">确认</Button>
                    </div>
                    <div>
                        <img src={nmt} alt=""/>
                        <img src={Degree} alt=""/>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Recommended;
