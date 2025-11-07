import Main from '../MoviesPage/Main'
import Navigation from '../MoviesPage/Nav'
import Button from '../../Components/Button'
import Header from '../../Components/Header'
import { useAdminData } from '../../Api/AdminDataProvider'

export default function MoviesPage() {
    const {films} = useAdminData()
    return (
        <>
            <Header />
            <div className="index">
                <div className="button-wrap index-button">
                    <Button className='login'>Войти</Button>
                </div>
                <Navigation />
                {films.map((film) => (
                    <Main key={film.id} {...film}/>
                ))}
            </div>
        </>
    )
}