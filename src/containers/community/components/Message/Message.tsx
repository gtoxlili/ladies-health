import { Button, Modal, Input, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useClient } from "@lib/hook";
import "./Message.css"

// @ts-ignore
import picture from "../../static/picture.png"

interface Props {
    Status: boolean;
    handleShow: () => void;
    handleClose: () => void;
}

const Recommended: React.FC<Props> = (props) => {

    const { state } = useLocation();
    const client = useClient();

    const [noficationsList, setNotificationsList] = useState(null)

    useEffect(() => {
        let params = {
            id: '1'
        }
        client.getNotificationsList(params).then(res => {
            let data = res.data.data
            data.map((item: { release_time: string }) => {
                //格式化时间
                let dateTime = new Date(item.release_time).toLocaleString();
                item.release_time = dateTime
            })
            setNotificationsList(data)
            console.log(noficationsList);
        })
    }, [state])

    if (noficationsList === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className='xzcMessage'>
            <Modal
                className="c2Modal"
                footer={null}
                okText="确定" cancelText="取消" title="消息通知" open={props.Status} onOk={props.handleShow} onCancel={props.handleClose}>
                <div className="c3line"></div>
                {noficationsList.map((item, index) => (
                    <div className="c4giveaLike">
                        <div className="content">
                            <img src={item.user_photo} />
                            <span>{item.user_name}  {item.content}</span>
                        </div>
                        <span> {item.release_time}</span>
                    </div>
                ))}
                <div className="c2footerBtn">
                    <div>
                        <Button onClick={props.handleClose}>取消</Button>
                        <Button onClick={props.handleClose} style={{ marginLeft: "10px", backgroundColor: "#1677ff", color: "#FFFFFF" }} >确定</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Recommended;
