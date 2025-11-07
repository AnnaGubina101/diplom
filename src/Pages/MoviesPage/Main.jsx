import { useAdminData } from "../../Api/AdminDataProvider";
import React from "react"

export default function Main() {
    const {films, halls, seances} = useAdminData();
    return (
        <div className="index-main">
            {films.map(film => (
                <React.Fragment key={film.id}>
                <section className='index-main-section'>
                    <div className="index-main-section__movie-info">
                    <div className="img-wrapper">
                        <img src={film.film_poster} alt={film.film_name} className="index-image"/>
                    </div>
                    <div className="index-main-section__info">
                        <strong className="index-name">{film.film_name}</strong>
                        <p className="index-description">{film.film_description}</p>
                        <p className="index-time">{film.film_duration} мин,  {film.film_origin}</p>
                    </div>
                </div>
                <div className="index-main-section__movie-seances-halls">
                        <div className="movie-seances">
                            {halls.map((hall) => {
                                const hallSeances = seances.filter(
                                    (seance) =>
                                        seance.seance_hallid === hall.id &&
                                        seance.seance_filmid === film.id
                                    );

                                if (hallSeances.length === 0) return null;
                                return (
                                <div className="movie-seances-halls__info" key={hall.id}>
                                <strong>{hall.hall_name}</strong>
                                <div className="movie-seances">
                                    {seances.filter(seance => 
                                    seance.seance_hallid === hall.id && seance.seance_filmid === film.id).map((seance) => (
                                    <button key={seance.id} className="seances-button">{seance.seance_time}</button>
                                    ))}
                                </div>
                                </div>
                                )
                            })}
                        </div>
                    </div>
            </section>
                </React.Fragment>
            ))}
        </div>
    )
}