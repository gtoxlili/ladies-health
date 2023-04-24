import React, {lazy, Suspense, useEffect} from "react";
import "@styles/common.css";
import {createHashRouter, Navigate, Outlet, RouterProvider, useNavigate} from "react-router-dom";

import {useCheckAuth} from "@service";
import {enqueueSnackbar} from "notistack";
import './style.css'
import Sidebar from "@containers/sidebar";
import {CircularProgress} from "@mui/material";

const Home = lazy(() => import('@containers/home'))
const Auth = lazy(() => import('@containers/auth'))
const Personal = lazy(() => import('@containers/personal'))
const Inquiry = lazy(() => import('@containers/inquiry'))

// 个人体征子路由
const Menstrual = lazy(() => import('@containers/personal/component/menstrual'))
const Sleep = lazy(() => import('@containers/personal/component/sleep'))
const Sport = lazy(() => import('@containers/personal/component/sport'))
const Water = lazy(() => import('@containers/personal/component/water'))

const Index = () => {
    const error = useCheckAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (error) {
            enqueueSnackbar(`${error} | 跳转至登录页面`, {variant: 'warning'})
            navigate('/login', {replace: true})
        }
    }, [error])

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

const routers = createHashRouter([
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
