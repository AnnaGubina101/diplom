import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
         <div className='header'>
            <h1 className='header-main' onClick={() => navigate("/")}>Идем<span className='header__letter'>В</span>Кино </h1>
        </div>
    )
}