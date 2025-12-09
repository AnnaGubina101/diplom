import Button from '../../Components/Button'
import Seats from '../SeatsPage/Seats'
import Header from '../../Components/Header'
import Hall from '../SeatsPage/Hall'
import { useParams } from "react-router-dom";
import { useAdminData } from '../../Api/AdminDataProvider';
import { useNavigate } from 'react-router-dom';
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function SeatsPage() {
    const { seanceId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); 
    const { halls, films, seances } = useAdminData();
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();
    const date = location.state?.date || new Date().toISOString().split("T")[0];


    useEffect(() => {
        setSelectedSeats([]);
    }, [date, setSelectedSeats]);

    const seance = seances.find(s => s.id === Number(seanceId));
    if (!seance) return <p>Загрузка...</p>;

    const hall = halls.find(h => h.id === seance.seance_hallid);
    const film = films.find(f => f.id === seance.seance_filmid);

    return (
        <>
        <div className="wrap">
            <Header />
                <div className="hall">
                    <Hall title={film.film_name} time={seance.seance_time} hallName={hall.hall_name}/>
                    <Seats hall={hall} seance={seance} date={date} key={seance.id + date}/>
                    <div className="button-wrap">
                        <Button
                        className='book'
                        onClick={() =>
                            navigate(`/payment/${seance.id}`, {
                            state: {
                                date,
                                seanceId: seance.id,
                                filmName: film.film_name,
                                hallName: hall.hall_name,
                                time: seance.seance_time,
                                seats: selectedSeats,
                                prices: {
                                standard: hall.hall_price_standart,
                                vip: hall.hall_price_vip,
                                },
                            },
                            })
                        }
                        disabled={selectedSeats.length === 0}
                        >Забронировать</Button>
                    </div>
                </div>
        </div>
        </>
    )
}