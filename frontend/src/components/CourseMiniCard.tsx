import axios from "axios"
import { ICourse } from "../pages/CoursesListPage"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

export function CourseMiniCard({id}:{id: string}) {
    const [[token]] = useContext(AuthContext)

    async function fetchCourse() {
        return (await axios.get<{course: ICourse}>(`http://localhost:8000/course/${id}`, {headers: {Authorization: token}})).data
    }

    const {data} = useQuery({queryKey: ['course', id], queryFn: fetchCourse, enabled: !!token})

    return (
        <Link to={`/${id}`}>{data?.course.title}</Link>
    )
}