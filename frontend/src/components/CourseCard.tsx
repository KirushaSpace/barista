import { Card } from "antd";

export function CourseCard({description, title}:{title: string, description: string}) {
    return <Card className="bg-white rounded-lg shadow-md p-4" title={<h1 className="text-lg font-bold mb-2">{title}</h1>}>{description}</Card>
}