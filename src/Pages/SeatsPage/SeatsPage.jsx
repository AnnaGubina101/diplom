import Button from '../../Components/Button'
import Seats from '../SeatsPage/Seats'
import Header from '../../Components/Header'
import Hall from '../SeatsPage/Hall'

export default function SeatsPage() {
    return (
        <>
            <Header />
                <div className="hall">
                    <Hall {...movies[0]} />
                    <Seats />
                    <div className="button-wrap">
                        <Button className='book'>Забронировать</Button>
                    </div>
                </div>
        </>
    )
}