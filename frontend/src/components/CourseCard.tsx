import { Card } from "antd";

export function CourseCard({description, title}:{title: string, description: string}) {
    return <Card title={title}>{description}</Card>
}