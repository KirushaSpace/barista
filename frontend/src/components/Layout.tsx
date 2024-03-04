import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export function Layout() {
    return (
        <div className="flex flex-col gap-y-10 pt-4 px-4 justify-center min-h-screen bg-gray-200">
            <Header />
            <Outlet/>
        </div>
    )
}