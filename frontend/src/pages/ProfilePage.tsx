import axios from "axios"
import { useContext, useState } from "react"
import { AuthContext } from "../AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import { Navigate } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ICourse } from "./CoursesListPage";
import { ICourseStats } from "./CoursePage";
import { CourseMiniCard } from "../components/CourseMiniCard";

interface IUser {
    first_name: string;
    last_name: string;
    phone: string;
    username: string;
    process: number;
    finish: number;
    role: string;
    level: string;
    id: string;
}

interface IEditFormData {
    "first_name": string,
    "last_name": string
    phone: string
}

export function Profile() {
    const [[token]] = useContext(AuthContext)

    async function fetchUser() {
        return (await axios.get<IUser>('http://localhost:8000/user', {headers: {Authorization: token}})).data
    }

    const {data} = useQuery({queryKey:['user',token], queryFn: fetchUser, enabled: !!token})

    const [isVisible, setIsVisible] = useState(false);

    const {control, handleSubmit} = useForm<IEditFormData>()

    async function updateUser(data: IEditFormData) {
        return (await axios.patch<IUser>('http://localhost:8000/user', data, {headers: {Authorization: token}})).data
    }

    const queryClient = useQueryClient()

    const {mutate} = useMutation({mutationFn: updateUser, mutationKey: ['update', token], onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['user', token]})
    }})

    const onSubmit: SubmitHandler<IEditFormData> = data => {
        mutate(data)
        setIsVisible(false)
    }

    async function fetchStats() {
        return (await axios.get<ICourseStats[]>('http://localhost:8000/user/statistics', {headers:{Authorization:token}})).data
    }

    const {data:stats} = useQuery({queryKey: ['user_stats', token], queryFn: fetchStats, enabled: !!token})

    if (!token) return <Navigate to={'/signin'}/>

    return (
        <div>
            <h1>{data?.username}</h1>
            <h2>{data?.first_name} {data?.last_name}</h2>
            <h3>{data?.level}</h3>
            <h3>{data?.phone}</h3>
            <Button onClick={()=>setIsVisible(true)}>редактировать</Button>
            <h3>В процессе:</h3>
            <div>{stats?.filter(stat=>stat.course_progress < (stat.course_stats["course_count_modules"] as number)).map(stat=><CourseMiniCard key={stat.course_id} id={stat.course_id}/>)}</div>
            <h3>Выполнены:</h3>
            <div>{stats?.filter(stat=>stat.course_progress === (stat.course_stats["course_count_modules"] as number)).map(stat=><CourseMiniCard key={stat.course_id} id={stat.course_id}/>)}</div>
            <Modal open={isVisible} onCancel={()=>setIsVisible(false)} footer={null}>
                <Form onSubmitCapture={handleSubmit(onSubmit)}>
                    <Form.Item>
                        <Controller control={control} name="first_name" render={({field}) => <Input placeholder="first_name" {...field}/>} />
                        <Controller control={control} name="last_name" render={({field}) => <Input placeholder="last_name" {...field}/>} />
                        <Controller control={control} name="phone" render={({field}) => <Input placeholder="phone" {...field}/>} />
                    </Form.Item>
                    <Button htmlType="submit">Сохранить</Button>
                </Form>
            </Modal>
        </div>
    )
}