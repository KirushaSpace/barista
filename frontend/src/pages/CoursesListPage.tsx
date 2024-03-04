import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CourseCard } from "../components/CourseCard"
import { Link, Navigate } from "react-router-dom"
import { IModule } from "./CoursePage"

export interface ICourse {
    title: string;
    description: string;
    access: string[];
    id: string;
    user_id: string;
    modules: IModule[];
}

export function CoursesListPage() {
    const [[token]] = useContext(AuthContext)

    async function fetchCourses() {
        return (await axios.get<Pick<ICourse, 'title'|'description'|'id'>[]>('http://localhost:8000/course', 
        {headers: { Authorization: token}})).data
    }

    const {data} = useQuery({queryKey: ['courses'], queryFn: fetchCourses, select: (courses) => courses, enabled: !!token})  

    if (!token) return <Navigate to={'/signin'}/>

    return (
        <div className="pl-4">
            {data?.map(({description, id, title}) => (
                <Link key={id} to={`/${id}`} className="block mb-4 no-underline">
                    <CourseCard title={title} description={description}/>
                </Link>
            ))}
        </div>
    )
}