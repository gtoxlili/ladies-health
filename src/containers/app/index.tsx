import React, {lazy, Suspense, useEffect} from "react";
import "@styles/common.css";
import {createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigate} from "react-router-dom";

import {useCheckAuth} from "@service";
import {enqueueSnackbar} from "notistack";
import './style.css'
import Sidebar from "@containers/sidebar";
import {CircularProgress} from "@mui/material";
import {useClient} from "@lib/hook";

const Home = lazy(() => import('@containers/home'))
const Auth = lazy(() => import('@containers/auth'))
const Personal = lazy(() => import('@containers/personal'))
const Inquiry = lazy(() => import('@containers/inquiry'))
const Healty  = lazy(() => import('@containers/healty'))

// 个人体征子路由
const Menstrual = lazy(() => import('@containers/personal/component/menstrual'))
const Sleep = lazy(() => import('@containers/personal/component/sleep'))
const Sport = lazy(() => import('@containers/personal/component/sport'))
const Water = lazy(() => import('@containers/personal/component/water'))
// 提醒管理子路由
const HealtyManage = lazy(() => import('@containers/healty/component/manage'))
const HealtyAdd = lazy(() => import('@containers/healty/hedalthyAdd'))
const HealTodo = lazy(() => import('@containers/healty/component/todo'))
const HealFinish = lazy(() => import('@containers/healty/component/finish'))
const HealthDetail = lazy(() => import('@containers/healty/healthyDetail'))


const Index = () => {
    const error = useCheckAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (error) {
            enqueueSnackbar(`${error} | 跳转至登录页面`, {variant: 'warning'})
            navigate('/login', {replace: true})
        }
    }, [error])
   
   // 健康提醒增加
    useEffect(()=>{

        const fetchData = async () => {
            // console.log('fetchData...' ,123)
            client.getCount().then((res:any) =>{
                let code =res.data.code ;
                if(code !== 200){
                    return;
                }
                if(res.data.data == 0){
                    return ;
                }
                enqueueSnackbar(`您有${res.data.data}待处理, 请您到【健康管理/待办】查阅`, {variant: 'success'})
            })
        }

        const intervalId = setInterval(() => {
            fetchData();
        }, 10000);  

        return () => clearInterval(intervalId);
    },[error])

    return <div className='flex'>
        <Sidebar/>
        <div className="app-container">
            <Suspense
                fallback={<div className='h-screen flex justify-center items-center'>
                    <CircularProgress size='3rem'/>
                </div>}
            ><Outlet/>
            </Suspense>
        </div>
    </div>
}

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Index/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
            // 个人体征
            {
                path: "/personal",
                element: <Personal/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/personal/menstrual"/>,
                    }, {
                        path: 'menstrual',
                        element: <Menstrual/>,
                    }, {
                        path: 'sleep',
                        element: <Sleep/>,
                    }, {
                        path: 'sport',
                        element: <Sport/>,
                    }, {
                        path: 'water',
                        element: <Water/>,
                    }
                ]
            },
            // 问诊记录
            {
                path: "/inquiry",
                element: <Inquiry/>,
            },
            // 社区交流
            {
                path: "/community",
                element: <div>Come Soon</div>,
            }
        ]
    },
     //健康提醒
            {
                path: "/helathy",
                element: <Healty />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/helathy/manage"/>,
                    }, {
                        path: 'manage',
                        element: <HealtyManage/>,
                    }, {
                        path: 'todo',
                        element: <HealTodo/>,
                    }, {
                        path: 'finish',
                        element: <HealFinish/>,
                    }, 
                    {
                        path: 'add',
                        element: <HealtyAdd/>,
                    },
                    {
                        path: 'edit',
                        element: <HealtyAdd/>,
                    },
                    {
                        path: 'detail',
                        element: <HealthDetail/>,
                    }
                ]
            },
    {
        path: "/login",
        element: <Auth/>,
    }
])

const App = () => <>
    <div className="bg-container">
        <div className="faint-glow-blue mb-12"></div>
        <div className="faint-glow-red"></div>
    </div>
    <Suspense><RouterProvider router={routers}/></Suspense>
</>
export default App
