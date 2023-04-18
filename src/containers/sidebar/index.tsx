import React from "react";
// @ts-ignore
import logo from "@assets/logo.jpg";
// @ts-ignore
import avatar from "@assets/avatar.jpg";
import {List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import {userAtom} from "@stores/jotai";
import {useAtomValue} from "jotai";
import {useNavigate} from "react-router-dom";

const sidebarItems = [
    {
        Icon: <HomeIcon/>,
        title: "首页",
        link: "/"
    },
    {
        Icon: <FitnessCenterIcon/>,
        title: "个人体征",
        link: "/personal"
    },
    {
        Icon: <AssignmentIcon/>,
        title: "问诊记录",
        link: "/inquiry"
    },
    {
        Icon: <ForumIcon/>,
        title: "社区交流",
        link: "/community"
    }
];

const Sidebar = () => {
    const userInfo = useAtomValue(userAtom)
    const navigate = useNavigate()


    return <div
        className='flex w-72 flex-shrink-0 flex-col h-screen'
    >
        <div className="flex items-center justify-center py-12">
            <img src={logo} alt="WoMen" className="rounded-2xl h-20"/>
            <span className='pl-4 font-semibold text-lg text-rose-900'>WoMen</span>
        </div>
        <List sx={{flex: 1}}>
            {sidebarItems.map((item, index) => (
                <ListItemButton
                    sx={{
                        paddingX: '4rem',
                    }}
                    onClick={() => navigate(item.link)}
                    key={index} alignItems="center">
                    <ListItemIcon>
                        {item.Icon}
                    </ListItemIcon>
                    <ListItemText sx={{
                        textAlign: 'center'
                    }} primary={<span className='text-sm'>{item.title}</span>}/>
                </ListItemButton>
            ))}
        </List>
        <div className="flex items-center justify-center py-12">
            <img src={avatar} alt="Avatar" className="rounded-full h-12"/>
            <div>
                <div className='pl-4 text-sm font-medium mb-0.5'>{userInfo.username}</div>
                <div className='pl-4 text-xs'>你的个性签名</div>
            </div>
        </div>
    </div>

}

export default Sidebar
