import { Button, Input, Modal, Upload } from 'antd';
import type { UploadProps } from 'antd';
import React, { useState } from 'react';
import { useClient } from "@lib/hook";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recommended.css"

// @ts-ignore
import nmt from "../../static/b0221e047045b8c355a7fa3567f5428b.jpeg@3x.png"
// @ts-ignore
import Degree from "../../static/Degree.png"

// @ts-ignore
import smilingFace from "../../static/smilingFace.png"
// @ts-ignore
import Image from "../../static/Image.png"

interface Props {
    Status: boolean;
    title: string;
    handleShow: () => void;
    handleClose: () => void;
}


const Recommended: React.FC<Props> = (props) => {

    const { state } = useLocation();
    const client = useClient();

    const imgprops: UploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const [RecommendedText, setRecommendedText] = useState('')
    const RecommendedSubmit = () => {
        let params = {
            user_name: 'KKK123',
            user_id: 4,
            theme_title: props.title,
            content: RecommendedText,
            user_photo: '/src/containers/community/static/picture.png',
            like_num: 0,
            come_from: '广东',
            img: '/src/containers/community/static/paiyipai.jpg'
        }
        client.Recommended(params).then(res => {
            setRecommendedText('')
            props.handleClose()
        })
    }

    const { TextArea } = Input;
    return (
        <div className='zxcRecommended'>
            <Modal
                className="c2Modal"
                footer={null}
                okText="确定" cancelText="取消" title={props.title} open={props.Status} onOk={() => props.handleShow}
                onCancel={props.handleClose}>
                <TextArea rows={4}
                    placeholder="说说你想说的话"
                    value={RecommendedText}
                    onChange={(e) => setRecommendedText(e.target.value)} />
                <div className="c2footerBtn">
                    <div>
                        <Button onClick={props.handleClose}>取消</Button>
                        <Button onClick={RecommendedSubmit} style={{ marginLeft: "10px", backgroundColor: "#1677ff", color: "#FFFFFF" }} >确定</Button>
                    </div>
                    <div>
                        <Upload {...props}>
                            <img src={Image} alt="" className='upload'></img>
                        </Upload>
                        <img src={smilingFace} alt="" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Recommended;
