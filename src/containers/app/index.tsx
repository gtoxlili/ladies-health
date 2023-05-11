import React, {lazy, Suspense, useEffect} from "react";
import "@styles/common.css";
import {createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigate} from "react-router-dom";

import {useCheckAuth, useHealthReminder} from "@service";
import {enqueueSnackbar} from "notistack";
import './style.css'
import Sidebar from "@containers/sidebar";
import {CircularProgress} from "@mui/material";

const Home = lazy(() => import('@containers/home'))
const Auth = lazy(() => import('@containers/auth'))
const Personal = lazy(() => import('@containers/personal'))
const Inquiry = lazy(() => import('@containers/inquiry'))
const Healty = lazy(() => import('src/containers/reminder'))

// 个人体征子路由
const Menstrual = lazy(() => import('@containers/personal/component/menstrual'))
const Sleep = lazy(() => import('@containers/personal/component/sleep'))
const Sport = lazy(() => import('@containers/personal/component/sport'))
const Water = lazy(() => import('@containers/personal/component/water'))

// 提醒管理子路由
const HealtyManage = lazy(() => import('@containers/reminder/component/manage'))
const HealtyAdd = lazy(() => import('@containers/reminder/hedalthyAdd'))
const HealTodo = lazy(() => import('@containers/reminder/component/todo'))
const HealFinish = lazy(() => import('@containers/reminder/component/finish'))
const HealthDetail = lazy(() => import('@containers/reminder/healthyDetail'))

// 懒加载交流模块
const Community = lazy(() => import('@containers/community'))


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
    useHealthReminder(error);

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
                path: "/index",
                element: <Community/>,
            },    //健康提醒
            {
                path: "/helathy",
                element: <Healty/>,
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
