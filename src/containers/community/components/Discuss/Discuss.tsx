import { Button, Input, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { useClient } from "@lib/hook";
import { useLocation, useNavigate } from "react-router-dom";
import "./Discuss.css"

// @ts-ignore
import smilingFace from "../../static/smilingFace.png"
// @ts-ignore
import Image from "../../static/Image.png"

interface Props {
    Status: boolean;
    CommentId: number;
    handleShow: () => void;
    handleClose: () => void;
    refreshView: () => void;
}

const Discuss: React.FC<Props> = (props) => {

    const { state } = useLocation();
    const client = useClient();

    const [textValue, setTextValue] = useState('');

    const DiscussSubmit = () => {
        let params = {
            reply_content: textValue,
            comment_id: props.CommentId,
            come_from: '广东',
            user_photo: '/src/containers/community/static/avatar.jpg',
            user_name: 'KKK123'
        }
        client.Discuss(params).then(res => {
            props.refreshView()
            props.handleClose()
            console.log(props.refreshView);
            console.log(typeof props.refreshView);
            setTextValue('')
        })
    }
    const handleDisClose = () => {
        props.handleClose()
        setTextValue('')
    }

    const { TextArea } = Input;
    return (
        <div className='Discuss'>
            <Modal
                className="c2Modal"
                footer={null}
                okText="确定" cancelText="取消" title="评论" open={props.Status} onOk={props.handleShow} onCancel={props.handleClose}>
                <TextArea rows={4}
                    placeholder="说说你想说的话"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)} />
                <div className="c2footerBtn">
                    <div>
                        <Button onClick={handleDisClose}>取消</Button>
                        <Button onClick={DiscussSubmit} style={{ marginLeft: "10px", backgroundColor: "#1677ff", color: "#FFFFFF" }} >确定</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Discuss;
