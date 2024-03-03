import { useMutation } from "@tanstack/react-query"
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

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
    const [, setToken] = useContext(AuthContext)
    const {mutate} = useMutation({mutationFn: SignIn, onSuccess: ({access_token, token_type})=>{
        setToken(`${token_type} ${access_token}`)
    }});

    const {control, reset, handleSubmit} = useForm<ISignInRequest>()

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const onSubmit: SubmitHandler<ISignInRequest> = (data) => {
        mutate(data)
        reset()
    }
 
    return (
        <Form onSubmitCapture={handleSubmit(onSubmit)}>
            <Form.Item>
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
            <Button htmlType="submit">Авторизироваться</Button>
        </Form>
    )
}