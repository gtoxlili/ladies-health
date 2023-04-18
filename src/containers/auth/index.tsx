import React, {useState} from "react";

// @ts-ignore
import logo from "@assets/logo.jpg";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useImmer} from "use-immer";
import {LoginParams, RegisterParams, useLoginService, useRegisterService} from "@service/auth";
import {LoadingButton} from "@mui/lab";

// 登录
const Login = () => {
    // 登录方式
    // const [loginType, setLoginType] = useState("username");
    // // 帐号
    // const [username, setUsername] = useState("");
    // // 密码
    // const [password, setPassword] = useState("");

    const [info, setInfo] =
        useImmer<LoginParams>({
            loginType: "username",
            rememberMe: true,
        } as LoginParams)

    const {handler, loading} = useLoginService()

    return <div className='space-y-4 flex flex-col'>
        <FormControl variant='standard' sx={{width: '33%'}}>
            <InputLabel>登录方式</InputLabel>
            <Select
                label="登录方式"
                value={info.loginType}
                onChange={(event) => setInfo(draft => {
                    draft.loginType = event.target.value as LoginParams['loginType']
                })}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value='username'>用户名</MenuItem>
                <MenuItem value='phone'>手机号</MenuItem>
                <MenuItem value='email'>邮箱</MenuItem>
            </Select>
        </FormControl>
        <TextField
            required
            label={`请输入${info.loginType === 'email' ? '邮箱' : info.loginType === 'phone' ? '手机号' : '用户名'}`}
            variant="standard"
            value={info.args || ''}
            onChange={(event) => setInfo(draft => {
                draft.args = event.target.value
            })}
        />
        <TextField
            required
            label="请输入密码"
            variant="standard"
            value={info.password || ''}
            type="password"
            autoComplete="current-password"
            onChange={(event) => setInfo(draft => {
                draft.password = event.target.value
            })}
        />
        <div className='h-[4px]'/>
        <FormControlLabel control={<Checkbox checked={info.rememberMe} onChange={
            (event) => setInfo(draft => {
                draft.rememberMe = event.target.checked
            })
        }/>} label="七天内免登录"/>
        <LoadingButton variant="contained" size="large" loading={loading} disableElevation
                       onClick={() => handler(info)}
        >登录</LoadingButton>
    </div>
}

// 注册
const Register = () => {
    /*
        1. 用户名
        2. 手机号
        3. 邮箱
        4. 密码
        5. 确认密码
        6. 验证码
        7. 注册按钮
     */

    const [info, updateInfo] = useImmer<RegisterParams & { confirmPassword: string }>({
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const {handler, loading} = useRegisterService()

    // 密码是否一致的状态
    const [isPasswordSame, setIsPasswordSame] = useState(true)

    return <div className='space-y-4 flex flex-col'>
        <TextField
            required
            label="用户名"
            variant="standard"
            value={info.username}
            onChange={(event) => updateInfo(draft => {
                draft.username = event.target.value
            })}
        />
        <TextField
            label="手机号"
            variant="standard"
            value={info.phone}
            onChange={(event) => updateInfo(draft => {
                draft.phone = event.target.value
            })}
        />
        <TextField
            label="邮箱"
            variant="standard"
            value={info.email}
            onChange={(event) => updateInfo(draft => {
                draft.email = event.target.value
            })}
        />
        <TextField
            required
            label="密码"
            variant="standard"
            value={info.password}
            type="password"
            autoComplete="current-password"
            onChange={(event) => updateInfo(draft => {
                draft.password = event.target.value
            })}
            onBlur={() => info.confirmPassword === '' || info.password === info.confirmPassword ? setIsPasswordSame(true) : setIsPasswordSame(false)}
        />
        <TextField
            required
            error={!isPasswordSame}
            helperText={!isPasswordSame ? '两次密码不一致' : ''}
            label="确认密码"
            variant="standard"
            value={info.confirmPassword}
            type="password"
            autoComplete="current-password"
            onChange={(event) => updateInfo(draft => {
                draft.confirmPassword = event.target.value
            })}
            onBlur={() => info.password === info.confirmPassword ? setIsPasswordSame(true) : setIsPasswordSame(false)}
        />
        <div className='h-[12px]'/>
        <LoadingButton loading={loading} variant="contained" size="large" disableElevation
                       onClick={() => isPasswordSame && info.confirmPassword && handler(info)}
        >注册并登录</LoadingButton>
    </div>
}

const Auth = () => {
    const [value, setValue] = useState(0);
    return <div
        className="flex items-center justify-evenly h-screen auth-container"
    >
        <div className="w-[275px] text-center space-y-1 select-none">
            <img src={logo} alt="WoMen" className="rounded-2xl"/>
            <div className='pt-4 text-rose-900 text-4xl font-semibold tracking-[0.6em] indent-[0.6em]'>我们</div>
            <div className='text-rose-900/40 text-sm font-medium'>We are the world</div>
        </div>
        <div className='bg-neutral-50/60 shadow-md rounded-lg px-12 py-8 w-[400px]'>
            <div className='pb-8 w-4/5 m-auto'>
                <Tabs
                    onChange={(_, index) => setValue(index)}
                    value={value}
                    variant="fullWidth"
                >
                    <Tab label='登录'/>
                    <Tab label='注册'/>
                </Tabs>
            </div>
            {value === 0 && <Login/>}
            {value === 1 && <Register/>}
        </div>
    </div>
}

export default Auth
