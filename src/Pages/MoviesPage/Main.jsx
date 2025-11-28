import { useAdminData } from "../../Api/AdminDataProvider";
import { useNavigate } from "react-router-dom";

export default function Main({ film, selectedDay }) {
    const { halls, seances } = useAdminData();
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    return (
        <section className='index-main-section'>
            <div className="index-main-section__movie-info">
                <div className="img-wrapper">
                    <img src={film.film_poster} alt={film.film_name} className="index-image"/>
                </div>
                <div className="index-main-section__info">
                    <strong className="index-name">{film.film_name}</strong>
                    <p className="index-description">{film.film_description}</p>
                    <p className="index-time">{film.film_duration} мин, {film.film_origin}</p>
                </div>
            </div>

            <div className="index-main-section__movie-seances-halls">
                <div className="movie-seances">
                    {halls.map((hall) => {
                        let hallSeances = seances.filter(
                            (s) => s.seance_hallid === hall.id &&
                                   s.seance_filmid === film.id
                        );
                        if (selectedDay && selectedDay.full === today) {
                            hallSeances = hallSeances.filter((s) => {
                                const seanceTime = new Date(`${today}T${s.seance_time}:00`);
                                return seanceTime > now;
                            });
                        }

                        if (hallSeances.length === 0) return null;

                        return (
                            <div className="movie-seances-halls__info" key={hall.id}>
                                <strong>{hall.hall_name}</strong>
                                <div className="movie-seances">
                                    {hallSeances.map((seance) => (
                                        <button key={seance.id} onClick={() => navigate(`/seats/${seance.id}`)} className="seances-button">
                                            {seance.seance_time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}