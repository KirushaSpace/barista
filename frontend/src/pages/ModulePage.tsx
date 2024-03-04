import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { ICourseStats, IModule } from "./CoursePage"
import { Task } from "../components/Task"
import { Button } from "antd"
import { ICourse } from "./CoursesListPage"

export interface ITask {
    title: string;
    text: string;
    question: string;
    answers: string[];
    right_answer: string;
    id: string;
    module_id: string;
}

export function ModulePage() {
    const [[token]] = useContext(AuthContext)

    const {moduleId, courseId} = useParams<{moduleId: string, courseId: string}>()
    
    async function fetchModule() {
        return (await axios.get<IModule>(`http://localhost:8000/module/${moduleId}`, { headers: { Authorization: token }})).data
    }

    const {data: module} = useQuery({queryKey: ['course', moduleId], queryFn: fetchModule, enabled: !!token && !!moduleId})

    async function fetchCourse() {
        return (await axios.get<{course: ICourse, 'user_stat': ICourseStats}>(`http://localhost:8000/course/${courseId}`, 
        { headers: { Authorization: token }})).data
    }

    const {data} = useQuery({queryKey: ['course', courseId], queryFn: fetchCourse, enabled: !!token && !!courseId})

    if (!token) return <Navigate to={'/signin'}/>

    return (
        <div>
            <h1>{data?.course.title}</h1>
            <h2>{module?.title}</h2>
            <p>{module?.description}</p>
            <div>{module?.tasks.map(task => <Task key={task.id} {...task}/>)}</div>
            <Link to={`/${courseId}`}>
                <Button>К списку модулей</Button>
            </Link>
        </div>
    )
}