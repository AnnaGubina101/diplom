import Main from '../MoviesPage/Main'
import Navigation from '../MoviesPage/Nav'
import Button from '../../Components/Button'
import Header from '../../Components/Header'
import { useAdminData } from '../../Api/AdminDataProvider'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { generateGates } from '../MoviesPage/Nav'

export default function MoviesPage() {
    const { films, loading } = useAdminData();
    const navigate = useNavigate();
    const days = generateGates(30);
    const [selectedDay, setSelectedDay] = useState(days[0]);
    

    if (loading) return <p>Загрузка...</p>;

    return (
        <>
        <div className="wrap">
            <Header />
            <div className="index">
                <div className="button-wrap index-button">
                    <Button className='login' onClick={() => navigate('/login')}>Войти</Button>
                </div>
                <Navigation days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
                {films.map((film) => (
                    <Main key={film.id} film={film} selectedDay={selectedDay}/>
                ))}
            </div>
        </div>
        </>
    )
}