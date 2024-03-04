import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { Button } from "antd";

export function Header() {
    const [[_,setToken],[username]] = useContext(AuthContext)

    return (
        <header>
            <Link to={'/'}>Все курсы</Link>
            <Link to={'/profile'}>{username}</Link>
            <Button onClick={()=>setToken('')}>Выйти</Button>
        </header>
    )
}