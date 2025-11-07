import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
import deleteBin from "../../../assets/delete-bin.png";
import { useAdminData } from "../../../Api/AdminDataProvider";
import Button from "../../../Components/Button";
import { addSeance } from '../../../Api/addSeance'
import deleteSeance from '../../../Api/deleteSeance'

const ItemTypes = {
  FILM: "film",
  SEANCE: "seance",
};
const colors = ["rgba(202, 255, 133, 1)", "rgba(133, 255, 137, 1)", "rgba(133, 255, 211, 1)", "rgba(133, 226, 255, 1)", "rgba(133, 153, 255, 1)"];


function DraggableFilm({ film, simple = false }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.FILM,
    item: { film: { ...film, seanceId: film.seanceId } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const pxPerMinute = 0.5;
  const filmWidth = film.film_duration * pxPerMinute;

  return (
    <div
      ref={dragRef}
      key={film.id}
      style={{ 
        backgroundColor: colors[film.id % colors.length],
        opacity: isDragging ? 0.5 : 1,
        width: simple ? `${filmWidth}px` : "259px",
        border: '1px solid rgba(0, 0, 0, 0.3)'
      }} 
      className="session-grid-movie">
     {simple ? (
        <p style={{ fontSize: '10px' }}>{film.film_name}</p>
      ) : (
        <>
          <div className="session-grid-movie-poster-wrap">
            <img
              src={film.film_poster}
              alt={film.film_name}
              className="session-grid-movie-poster"
            />
          </div>
          <div className="session-grid-movie-info">
            <p className="session-grid-movie-title">{film.film_name}</p>
            <p className="session-grid-movie-duration">{film.film_duration} минут</p>
          </div>
          <button className="session-grid-movie-delete-btn">
            <img className="movie-delete-img" src={deleteBin} alt="Удалить" />
          </button>
        </>
      )}
    </div>
  );
}


function DroppableTimeline({ hall, filmsInHall, onDropFilm }) {
    const { halls, films } = useAdminData();
    const [isAdding, setIsAdding] = useState(false);
    const [selectedHall, setSelectedHall] = useState(hall?.id || "");
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState("");

    const handleCancelClick = () => {
        setIsAdding(false);
        setSelectedFilm(null);
        setTime("");
    }

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: ItemTypes.FILM,
        drop: (item) => { 
            setSelectedFilm(item.film);
            setIsAdding(true);},
        collect: (monitor) => ({ isOver: monitor.isOver() }),
    }));

    const handleSave = async (time) => {
        if (!selectedFilm || !selectedHall || !time) return;

        await addSeance(selectedHall, selectedFilm.id, time);
        onDropFilm(selectedHall, { ...selectedFilm, seanceTime: time });

        handleCancelClick();
    };

  return (
    <>
        <div
        ref={dropRef}
        style={{
            minHeight: "60px",
            width: '720px',
            border: '1px solid rgba(132, 132, 132, 1)',
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            padding: "10px",
            boxSizing: 'border-box',
            marginBottom: '35px'
        }}
        >
        {filmsInHall.map((film, idx) => (
            <DraggableFilm key={`${idx}-${film.id}`} film={film} simple/>
        ))}
        </div>

        {isAdding && (
            <div className="popup-overlay">
                <div className="session-grid-add-popup-form seance">
                    <div className="dashboard-header-wrap pop-up">
                        <h2 className="dashboard-header">Добавление сеанса</h2>
                        <img src="/src/assets/cross.png" alt="close" className="pop-up-cross" onClick={handleCancelClick}/>
                    </div>
                    <div className="session-grid-new-item">
                        <div className="session-grid-new-item-list">
                            <div className="session-grid-list-wrap">
                                <label htmlFor="hall-name" className="session-grid-list-label">Название зала</label>
                                <select
                                id="hall-name"
                                className="session-grid-list-select"
                                onChange={(e) =>
                                    setSelectedHall(e.target.value)
                                }
                                value={selectedHall}>
                                    <option value="">Название зала</option>
                                    {halls.map((hall) => (
                                        <option key={hall.id} value={hall.id}>
                                            {hall.hall_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="session-grid-list-wrap">
                                <label htmlFor="film-name" className="session-grid-list-label">Название фильма</label>
                                <select id="film-name"
                                className="session-grid-list-select"
                                value={selectedFilm?.id || ""}
                                onChange={(e) =>
                                    setSelectedFilm(films.find((f) => f.id === Number(e.target.value)))
                                }>
                                    <option value="">Название фильма</option>
                                    {films.map((film) => (
                                        <option key={film.id} value={film.id}>
                                            {film.film_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="session-grid-list-wrap">
                                <label htmlFor="seance-time" className="session-grid-list-label">Время сеанса</label>
                                <input
                                className="session-grid-list-input"
                                type="time"
                                id="seance-time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="session-grid-pop-up-buttons">
                            <Button type="button" onClick={handleSave} className="session-grid-button">Добавить фильм</Button>
                            <Button type="button" onClick={handleCancelClick} className="session-grid-button cancel">Отменить</Button>
                        </div>
                    </div>
                </div>
        </div>)}
    </>
  );
}

function TrashDropZone({ onDeleteSeance }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.FILM,
    drop: async (item) => {
      const seanceId = item.film.seanceId;
      if (!seanceId) return;

      try {
        await deleteSeance(seanceId);
        onDeleteSeance(seanceId);
      } catch (err) {
        console.error("Ошибка при удалении сеанса:", err);
        alert("Ошибка при удалении сеанса");
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
    className="trash-drop-zone"
    ref={dropRef}
    >
      <img className="trash-drop-zone-img" src={deleteBin} alt="Удалить" />
    </div>
  )
}

export default function Timeline({ halls, films }) {
  const [placements, setPlacements] = useState({});
  const { seances } = useAdminData();


  useEffect(() => {
    const initialPlacements = {};

    seances.forEach((seance) => {
      const film = films.find((f) => f.id === seance.seance_filmid);
      if (film) {
        if (!initialPlacements[seance.seance_hallid]) {
          initialPlacements[seance.seance_hallid] = [];
        }
        initialPlacements[seance.seance_hallid].push({
          ...film,
          seanceId: seance.id,
          seanceTime: seance.seance_time,
        });
      }
    });

    setPlacements(initialPlacements);
  }, [films, seances]);

  const handleDropFilm = (hallId, film) => {
    setPlacements((prev) => ({
      ...prev,
      [hallId]: [...(prev[hallId] || []), film],
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="session-grid-all-movies">
            {films.map((film, idx) => (
                <DraggableFilm key={`${idx}-${film.id}`} film={film}/>
            ))}
        </div>
      <div className="session-grid-movies-seances">
        <div className="session-grid-movies-seance-wrap">
          <ul className="seance-list">
            {Array.isArray(halls) &&
              halls
                .slice()
                .sort((a, b) => {
                  const numA = parseInt(a.hall_name.match(/\d+/)?.[0] || 0, 10);
                  const numB = parseInt(b.hall_name.match(/\d+/)?.[0] || 0, 10);
                  return numA - numB;
                })
                .map((hall) => (
                  <li key={hall.id} className="seance-list-item">
                    <p>{hall.hall_name}</p>
                    <DroppableTimeline
                      hall={hall}
                      filmsInHall={placements[hall.id] || []}
                      onDropFilm={handleDropFilm}
                    />
                  </li>
                ))}
          </ul>
        </div>
        <TrashDropZone
          onDeleteSeance={(seanceId) => {
            setPlacements((prev) => {
              const updated = {};
              for (const [hallId, films] of Object.entries(prev)) {
                updated[hallId] = films.filter(
                  (film) => film.seanceId !== seanceId
                );
              }
              return updated;
            });
          }}
        />
      </div>
    </DndProvider>
  );
}