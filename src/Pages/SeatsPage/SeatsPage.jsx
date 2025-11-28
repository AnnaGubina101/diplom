import Button from '../../Components/Button'
import Seats from '../SeatsPage/Seats'
import Header from '../../Components/Header'
import Hall from '../SeatsPage/Hall'
import { useParams } from "react-router-dom";
import { useAdminData } from '../../Api/AdminDataProvider';
import { useNavigate } from 'react-router-dom';
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";
import { useEffect } from 'react';

export default function SeatsPage() {
    const { seanceId } = useParams();
    const navigate = useNavigate();
    const { halls, films, seances, reload  } = useAdminData();
    const { selectedSeats } = useSelectedSeats();

    useEffect(() => {
        reload();
    }, []);

    const seance = seances.find(s => s.id === Number(seanceId));
    if (!seance) return <p>Загрузка...</p>;

    const hall = halls.find(h => h.id === seance.seance_hallid);
    const film = films.find(f => f.id === seance.seance_filmid);

    return (
        <>
        <div className="wrap">
            <Header />
                <div className="hall">
                    <Hall title={film.film_name} time={seance.seance_time} hallName={hall.hall_name} />
                    <Seats hall={hall} seance={seance} />
                    <div className="button-wrap">
                        <Button
                        className='book'
                        onClick={() => navigate(`/payment/${seance.id}`)}
                        disabled={selectedSeats.length === 0}
                        >Забронировать</Button>
                    </div>
                </div>
        </div>
        </>
    )
}