import { Button, Modal, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
// import Fuse from 'fuse.js';
import { useClient } from "@lib/hook";
import "./Involved.css"

// @ts-ignore
import nmt from "../../static/b0221e047045b8c355a7fa3567f5428b.jpeg@3x.png"
// @ts-ignore
import Degree from "../../static/Degree.png"
// import { ThemeProps } from "../../communityProps"


interface Props {
    Status: boolean;
    handleShow: () => void;
    handleClose: () => void;
    RecommendStatus: boolean;
    handleReShow: (title: string) => void;
    handleReClose: (title: string) => void;
}

const Involved: React.FC<Props> = (props) => {

    const { state } = useLocation();
    const client = useClient();

    // const [searchResults, setSearchResults] = useState([]);

    // const options = {
    //     keys: ['theme_title'], // 根据哪个属性进行搜索
    //   };

    const [themeList, setThemeList] = useState([
        {
            id: 1,
            title: '',
            photo: '',
            pants_num: 0,
            post_num: 0,
        }
    ])

    useEffect(() => {
        let params = {
            id: '1'
        }
        client.getThemeList(params).then(res => {
            let data = res.data.data
            setThemeList(data)
            // const fuse = new Fuse(themeList, options);
            // const results = fuse.search(themeList);
        })
    }, [state])

    return (
        <div className='Involved'>
            <Modal
                className="c2Modal"
                footer={null}
                closable={false}
                okText="确定" cancelText="取消" open={props.Status} onOk={props.handleShow} onCancel={props.handleClose}>
                <Input placeholder="搜索您感兴趣的话题" bordered={false} />
                <div className="c3line"></div>
                {themeList.map((item, index) => (
                    <div className="c3list">
                        <div className="content">
                            <img src={item.photo} alt="" />
                            <div>
                                <span className="text">#{item.title}#</span>
                                <div>
                                    <img src={Degree} alt="" />
                                    <span>热度{item.post_num}w</span>
                                </div>
                                <span className="c3bottom">{item.pants_num}网友热议中</span>
                            </div>
                        </div>
                        <Button className="c3btn" onClick={() => { props.handleReShow(item.title); props.handleClose(); }}>立即参与</Button>
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
export default Involved;
