import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Navigate, useParams } from "react-router-dom"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { IModule } from "./CoursePage"

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
    const [token] = useContext(AuthContext)

    const {moduleId} = useParams<{moduleId: string}>()

    console.log(moduleId);
    
    async function fetchModule() {
        return (await axios.get<IModule>(`http://localhost:8000/module/${moduleId}`, { headers: { Authorization: token }})).data
    }

    const {data} = useQuery({queryKey: ['course', moduleId], queryFn: fetchModule, enabled: !!token && !!moduleId})
    
    if(!token) <Navigate to={'signin'}/>
    return (
        <div>
            <h1>{data?.title}</h1>
            <p>{data?.description}</p>
            <div>{data?.tasks.map(task=><h4>{task.title}</h4>)}</div>
        </div>
    )
}