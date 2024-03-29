import { useMutation } from "@tanstack/react-query"
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

interface ISignInRequest {
    username: string
    password: string
}

interface ISignInResponse {
    "access_token": string
    "token_type": string
}

async function SignIn(data: ISignInRequest) {
    const formData = new FormData()
    formData.append("username", data.username)
    formData.append("password", data.password)
    return (await axios.post<ISignInResponse>('http://localhost:8000/user/login', formData)).data
}

export function SignInPage() {
    const [[token, setToken],[_,setUsername]] = useContext(AuthContext)
    const {mutate} = useMutation({mutationFn: SignIn, onSuccess: ({access_token, token_type})=>{
        setToken(`${token_type} ${access_token}`)
    }});

    const {control, reset, handleSubmit} = useForm<ISignInRequest>()

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const onSubmit: SubmitHandler<ISignInRequest> = (data) => {
        mutate(data)
        setUsername(data.username)
        reset()
    }

    const navigate = useNavigate()

    if (token) return <Navigate to={'/'}/>
 
    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <Form onSubmitCapture={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <Input
                            placeholder="username"
                            allowClear
                            {...field}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            visibilityToggle={{
                                visible: isPasswordVisible,
                                onVisibleChange: setIsPasswordVisible,
                            }}
                            placeholder="password"
                            allowClear
                            {...field}
                        />
                    )}
                />
                <div className="flex justify-between">
                    <Button htmlType="submit">Войти</Button>
                    <Button onClick={()=>navigate('/signup')}>Регистрация</Button>
                </div>
            </Form>
        </div>
    )
}