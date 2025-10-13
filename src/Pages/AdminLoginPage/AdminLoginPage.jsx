import Button from "../../Components/Button"
import AdminHeader from "../../Components/AdminHeader"
import login from "../../Api/login"
import { useState } from "react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if(email !== "shfe-diplom@netology.ru" || password !== "shfe-diplom") {
            console.error("Ошибка!")
        }
        const result = await login(email, password);
    }

    return (
        <>
        <div className="adminWrap">
            <AdminHeader />
            <div className="adminLogin">
                <h2 className="adminLogin-header">Авторизация</h2>
                <form className="adminLogin-form">
                    <label htmlFor="login" className="adminLogin-form_label">E-mail</label>
                    <input 
                        type="text"
                        id='login'
                        placeholder="example@domain.xyz"
                        className="adminLogin-form_input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />

                    <label htmlFor="password" className="adminLogin-form_label">Пароль</label>
                    <input
                        type="text"
                        id="password"
                        className="adminLogin-form_input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                </form>
                <div className="adminLogin-buttonWrap">
                    <Button type="button" className='adminLogin-button' onClick={handleLogin}>Авторизоваться</Button>
                </div>
            </div>
        </div>
        </>
    )
}
