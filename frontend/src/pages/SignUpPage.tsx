import { useMutation } from "@tanstack/react-query"
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

interface ISignUpRequest {
    "first_name": string,
    "last_name": string,
    phone: string,
    username: string,
    process: "0",
    finish: "1",
    role: "user",
    level: "junior",
    password: string
}

interface ISignUpResponse {
    "access_token": string
    "token_type": string
}

async function SignUp(data: ISignUpRequest) {
    return (await axios.post<ISignUpResponse>('http://localhost:8000/user/registartion', data)).data
}

export function SignUpPage() {
    const [token, setToken] = useContext(AuthContext)
    const {mutate} = useMutation({mutationFn: SignUp, onSuccess: ({access_token, token_type})=>{
        setToken(`${token_type} ${access_token}`)
    }});

    const {control, reset, handleSubmit} = useForm<ISignUpRequest>()

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const onSubmit: SubmitHandler<ISignUpRequest> = (data) => {
        mutate(data)
        reset()
    }

    const navigate = useNavigate()

    if (token) return <Navigate to={'/'}/>
 
    return (
        <Form onSubmitCapture={handleSubmit(onSubmit)}>
            <Form.Item>
                <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="first_name"
                                allowClear
                                {...field}
                            />
                        )}
                    />
                <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="last_name"
                                allowClear
                                {...field}
                            />
                        )}
                    />
                <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                
                                placeholder="phone"
                                allowClear
                                {...field}
                            />
                        )}
                    />
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
            </Form.Item>
            <Button htmlType="submit">Зарегистрироваться</Button>
            <Button onClick={()=>navigate('/singin')}>Вход</Button>
        </Form>
    )
}