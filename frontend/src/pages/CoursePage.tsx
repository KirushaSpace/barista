import { useContext, useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios"
import { ICourse } from "./CoursesListPage"
import { useQuery } from "@tanstack/react-query"
import { ITask } from "./ModulePage"
import { useSessionStorage } from "../hooks/useSessionStorage"

export interface IModule {
    title: string;
    description: string;
    id: string;
    course_id: string;
    tasks: ITask[];
}

export interface ICourseStats {
    "course_id": string
    "course_stats": {[key:string]:{[key:string]:boolean|number}|number}
    "course_progress": number
    id: string
}

export function CoursePage() {
    const [[token]] = useContext(AuthContext)

    const {courseId} = useParams<{courseId: string}>()    

    async function fetchCourse() {
        return (await axios.get<{course: ICourse, 'user_stat': ICourseStats}>(`http://localhost:8000/course/${courseId}`, 
        { headers: { Authorization: token }})).data
    }

    const [_, setUserStats] = useSessionStorage('user_stats', '');

    const {data, status, isSuccess} = useQuery({queryKey: ['course', courseId], queryFn: fetchCourse, enabled: !!token && !!courseId})

    useEffect(()=>{
        if(isSuccess) setUserStats(JSON.stringify(data.user_stat))
    },[status])

    if (!token) return <Navigate to={'/signin'}/>

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">{data?.course.title}</h1>
            <p className="text-gray-700 mb-6">{data?.course.description}</p>
            <h2 className="text-gray-700 mb-6">{data?.user_stat.course_progress} / {data?.user_stat.course_stats['course_count_modules'] as number}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data?.course.modules.map(module => <Link to={module.id} key={module.id} className="no-underline">
                <div className="bg-white shadow-md rounded-lg p-6 transition duration-300 ease-in-out ">
                    <h3 className="text-lg font-bold">{module.title}</h3>
                </div>
                </Link>
            )}</div>
        </div>
    )
}