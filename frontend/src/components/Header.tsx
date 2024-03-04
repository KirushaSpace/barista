import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { Button } from "antd";

export function Header() {
    const [[_,setToken],[username]] = useContext(AuthContext)

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-4 z-10 flex justify-between items-center text-lg font-bold mb-2">
            <Link to={'/'}>Все курсы</Link>
            <div className="flex gap-x-8 items-center">
                <Link to={'/profile'}>{username}</Link>
                <Button onClick={()=>setToken('')} className="bg-red-500 text-white font-bold">Выйти</Button>
            </div>
        </header>
    )
}