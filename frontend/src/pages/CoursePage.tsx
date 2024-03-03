import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios"
import { ICourse } from "./CoursesListPage"
import { useQuery } from "@tanstack/react-query"
import { ITask } from "./ModulePage"

export interface IModule {
    title: string;
    description: string;
    id: string;
    course_id: string;
    tasks: ITask[];
}

export function CoursePage() {
    const [token] = useContext(AuthContext)

    const {courseId} = useParams<{courseId: string}>()

    async function fetchCourse() {
        return (await axios.get<{course: ICourse, 'user_stat': any}>(`http://localhost:8000/course/${courseId}`, { headers: { Authorization: token }})).data
    }

    const {data} = useQuery({queryKey: ['course', courseId], queryFn: fetchCourse, enabled: !!token&&!!courseId})
    
    if(!token) <Navigate to={'signin'}/>

    return (
        <div>
            <h1>{data?.course.title}</h1>
            <p>{data?.course.description}</p>
            <div>{data?.course.modules.map(module=><Link to={module.id} key={module.id}><h3>{module.title}</h3></Link>)}</div>
        </div>
    )
}