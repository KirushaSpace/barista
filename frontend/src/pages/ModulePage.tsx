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
        <div className="font-sans antialiased text-gray-900 mt-28" style={{ marginTop: '60px' }}>
            <h1 className="text-2xl">{data?.course.title}</h1>
            <h2 className="text-xl">{module?.title}</h2>
            <p className="">{module?.description}</p>
            <div className="mt-4">
                {module?.tasks.map(task => 
                <div className="border border-gray-500 shadow-md rounded p-4 mb-4">
                    <Task key={task.id} {...task}/>
                </div>
                )}
                
            </div>
            <div className="flex justify-center mt-4">
        <Link to={`/${courseId}`}>
            <Button className="bg-blue-200 text-lg font-bold px-6 py-2 flex items-center">К списку модулей</Button>
        </Link>
    </div>
        </div>
    )
}