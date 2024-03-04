import { useContext, useState } from "react"
import { AuthContext } from "../AuthContext"
import { useMutation } from "@tanstack/react-query"
import { ITask } from "../pages/ModulePage"
import axios from "axios"
import { Radio, Form, Button } from "antd"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { useSessionStorage } from "../hooks/useSessionStorage"

interface ICheckAnswerResponse {
    "course_id": string
    "course_stats": {[key:string]:{[key:string]:boolean}}
    id: string
}

interface ICheckAnswerData {
    answer: string
}

export function Task({answers, question, id, text, title}: ITask) {
    const [userStats, setUserStats] = useSessionStorage('user_stats', '');
    const {moduleId} = useParams<{moduleId: string}>()

    const [isCorrect, setIsCorrect] = useState<-1|0|1>((JSON.parse(userStats!) as ICheckAnswerResponse)?.course_stats[moduleId!][id] ? 1: -1)
    const [[token]] = useContext(AuthContext)

    async function checkAnswer(answer: string) {
        return (await axios.post<ICheckAnswerResponse>(`http://localhost:8000/task/check_ans/${id}?answer_user=${answer}`, {}, 
        { headers: { Authorization: token }})).data;
    }

    const {control, handleSubmit} = useForm<ICheckAnswerData>()

    const {mutate} = useMutation({mutationFn: checkAnswer, onSuccess: (response) => {
        setUserStats(JSON.stringify(response))
        setIsCorrect((response as ICheckAnswerResponse)?.course_stats[moduleId!][id] ? 1: -1)
    }})

    const onSubmit: SubmitHandler<ICheckAnswerData> = data => {
        mutate(data.answer)
    }
    
    return (
        <div>
            <h3>{title}</h3>
            <p>{text}</p>
            <h4>{question}</h4>
            <Form onSubmitCapture={handleSubmit(onSubmit)}>
                <Form.Item>
                    <Controller control={control} name="answer" render={({field}) => <Radio.Group {...field} id={id} name="answer">
                        {answers.map(ans => <Radio disabled={isCorrect === 1} key={ans} value={ans}>{ans}</Radio>)}
                    </Radio.Group>} />
                </Form.Item>
                <Button htmlType="submit" disabled={isCorrect === 1}>Ответить</Button>
            </Form>
            {isCorrect !== 0 && <h3>{isCorrect === 1 ? 'Верно!' : 'Не верно'}</h3>}
        </div>
    )
}