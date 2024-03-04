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

    async function levelUp() {
        return (await axios.patch<IUser>('http://localhost:8000/user/update_level', {level: 'barista'}, {headers:{Authorization: token}})).data
    }

    const {mutate:updateLevel} = useMutation({mutationFn: levelUp, mutationKey: ['levelup'], onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['user', token]})
    }})

    if (!token) return <Navigate to={'/signin'}/>

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
            <h1 className="text-2xl">{data?.username}</h1>
            <h2 className="text-xl">{data?.first_name} {data?.last_name}</h2>
            <div className="mt-4">
            <h3 className="text-xl">{data?.level}</h3>
            {stats?.length===stats?.filter(stat=>stat.course_progress === (stat.course_stats["course_count_modules"] as number)).length && data?.level !== 'barista' ? <Button onClick={()=>updateLevel()}>Повысить уровень до barista</Button> : <></>}
            <h3 className="text-xl mt-4">{data?.phone}</h3>
        </div>
        
        <Button className="w-full mt-4" onClick={()=>setIsVisible(true)}>Редактировать</Button>
        <h3 className="mt-6">В процессе:</h3>
        <div className="flex flex-col gap-y-6 mt-4">
            {stats?.filter(stat=>stat.course_progress < (stat.course_stats["course_count_modules"] as number)).map(stat=><CourseMiniCard key={stat.course_id} id={stat.course_id}/>)}
        </div>
        <h3>Выполнены:</h3>
        <div className="flex flex-col gap-y-6 mt-4">
            {stats?.filter(stat=>stat.course_progress === (stat.course_stats["course_count_modules"] as number)).map(stat=><CourseMiniCard key={stat.course_id} id={stat.course_id}/>)}
        </div>
        <Modal open={isVisible} onCancel={()=>setIsVisible(false)} footer={null}>
            <Form onSubmitCapture={handleSubmit(onSubmit)}>
                <Form.Item className="flex flex-col gap-y-6 mt-4">
                    <Controller control={control} name="first_name" render={({field}) => <Input placeholder="Имя" {...field}/>} />
                    <Controller control={control} name="last_name" render={({field}) => <Input placeholder="Фамилия" {...field}/>} />
                    <Controller control={control} name="phone" render={({field}) => <Input placeholder="Телефон" {...field}/>} />
                </Form.Item>
                <Button htmlType="submit" className="w-full">Сохранить</Button>
            </Form>
        </Modal>
    </div>
</div>
    )
}