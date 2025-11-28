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

function timeToMinutes(time) {
  if (!time) return 0;
  if (typeof time === "string") {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  }
  if (typeof time === "number") {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return hours * 60 + minutes;
  }
  return 0;
}


function DraggableFilm({ film, simple = false, onDeleteFilm, style, onDraggingChange}) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.FILM,
    item: { film: { ...film, seanceId: film.seanceId } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    onDraggingChange?.(isDragging);
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      key={film.id}
      style={{
        ...style,
        backgroundColor: colors[film.id % colors.length],
        opacity: isDragging ? 0.5 : 1,
        height: simple ? "2.857rem" : "3.714rem",
        border: '1px solid rgba(0, 0, 0, 0.3)',
        alignItems: simple ? 'center' : '',
        padding: simple ? "0.714rem" : '',
        boxSizing: simple ?'border-box' : '',
        justifyContent: simple ? 'center' : '',
        overflow: "hidden"
      }} 
      className="session-grid-movie">
     {simple ? (
      <>
        <p style={{ fontSize: '0.7rem' }}>{film.film_name}</p>
      </>
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
          <button className="session-grid-movie-delete-btn" onClick={() => onDeleteFilm && onDeleteFilm(film)}>
            <img className="movie-delete-img" src={deleteBin} alt="Удалить" />
          </button>
        </>
      )}
    </div>
  );
}


function DroppableTimeline({ hall, filmsInHall, onDropFilm, onDraggingChange }) {
    const { halls, films } = useAdminData();
    const [isAdding, setIsAdding] = useState(false);
    const [selectedHall, setSelectedHall] = useState(hall?.id || "");
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const DAY_START = 10 * 60;
    const DAY_END = 23 * 60 + 59;
    const DAY_DURATION = DAY_END - DAY_START;
    
    function isTimeAvailable(filmsInHall, newTime, newDuration) {
      const newStart = timeToMinutes(newTime);
      const newEnd = newStart + newDuration;

      return !filmsInHall.some(film => {
        const existingStart = timeToMinutes(film.seanceTime);
        const existingEnd = existingStart + film.film_duration;
        return newStart < existingEnd && newEnd > existingStart;
      });
    }

    const handleCancel = () => {
        setIsAdding(false);
        setSelectedFilm(null);
        setTime("");
        isModalOpen(false)
    }

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: ItemTypes.FILM,
        drop: (item) => { 
            setSelectedFilm(item.film);
            setIsAdding(true);},
        collect: (monitor) => ({ isOver: monitor.isOver() }),
    }));

    const handleSavePopup = async () => {
        if (!selectedFilm || !selectedHall || !time) return;
        const seanceTimeString = String(time);

        const startMinutes = timeToMinutes(time);
        const endMinutes = startMinutes + selectedFilm.film_duration;

        if (!isTimeAvailable(filmsInHall, time, selectedFilm.film_duration)) {
          alert("Время сеанса пересекается с другим фильмом в этом зале!");
          return;
        }

        if (endMinutes > MAX_TIME) {
            alert("Этот сеанс заканчивается позже 23:59. Выберите другое время.");
            return;
        }

        onDropFilm(selectedHall, { ...selectedFilm, seanceTime: seanceTimeString, seanceId: null });

        handleCancel();
    };

  return (
    <>
     <div className="timeline-scroll">
        <div className="timeline-container" ref={dropRef}>
          {filmsInHall.map((film, idx) => {
            const [h, m] = film.seanceTime.split(":").map(Number);
            const startMin = h * 60 + m;
            const leftPct = ((startMin - DAY_START) / DAY_DURATION) * 100;
            let widthPct = (film.film_duration / DAY_DURATION) * 100;

            if (leftPct + widthPct > 100) widthPct = 100 - leftPct;
            if (leftPct < 0 || leftPct > 100) return null;

            return (
              <DraggableFilm
                key={`${film.id}-${idx}`}
                film={film}
                simple
                onDraggingChange={onDraggingChange}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  width: `${widthPct}%`
                }}
              />
            );
          })}
          {filmsInHall.map((film, idx) => {
            const [h, m] = film.seanceTime.split(":").map(Number);
            const startMin = h * 60 + m;

            const leftPct = ((startMin - DAY_START) / DAY_DURATION) * 100;
            if (leftPct < 0 || leftPct > 100) return null;

            return (
              <div
                key={`${film.id}-time-${idx}`}
                className="session-grid-movie-time"
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: "4.428rem"
                }}
              >
                {film.seanceTime}
              </div>
            );
          })}
        </div>
      </div>
        {isAdding && (
            <div className="popup-overlay">
                <div className="session-grid-add-popup-form seance">
                    <div className="dashboard-header-wrap pop-up">
                        <h2 className="dashboard-header">Добавление сеанса</h2>
                        <img src="/src/assets/cross.png" alt="close" className="pop-up-cross" onClick={handleCancel}/>
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
                            <Button type="button" onClick={handleSavePopup} className="session-grid-button">Добавить фильм</Button>
                            <Button type="button" onClick={handleCancel} className="session-grid-button cancel">Отменить</Button>
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
  const [isDraggingFilm, setIsDraggingFilm] = useState(false);


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

  const handleDeleteFilm = async (film) => {
    if (!film.id) return;

    const confirmDelete = window.confirm(`Удалить фильм "${film.film_name}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://shfe-diplom.neto-server.ru/film/${film.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.films) {
        setPlacements(prev => {
          const updated = {};
          for (const [hallId, films] of Object.entries(prev)) {
            updated[hallId] = films.filter(f => f.id !== film.id);
          }
          return updated;
        });
      } else {
        alert("Не удалось удалить фильм");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления фильма");
    }
  };

  const handleSaveAll = async () => {
    try {
      const promises = [];

      for (const hallId in placements) {
        placements[hallId].forEach(film => {
          if (!film.seanceId) {
            promises.push(
              addSeance({
                seanceHallid: hallId,
                seanceFilmid: film.id,
                seanceTime: film.seanceTime
              })
            );
          }
        });
      }

      await Promise.all(promises);

      alert("Все сеансы успешно сохранены!");
    } catch (e) {
      console.error(e);
      alert("Ошибка сохранения сеансов");
    }
  };

  const handleCancelAll = () => {
    setPlacements({});
  };

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="session-grid-all-movies">
            {films.map((film, idx) => (
                <DraggableFilm
                key={`${idx}-${film.id}`}
                film={film} onDeleteFilm={handleDeleteFilm}
                onDraggingChange={setIsDraggingFilm}/>
            ))}
        </div>
      <div className="session-grid-movies-seances">
       {isDraggingFilm && (<TrashDropZone
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
        />)}
        <div className="session-grid-movies-seance-wrap">
          <ul className="seance-list">
            {Array.isArray(halls) &&
              halls
                .slice()
                .sort((a, b) => {
                  const numA = parseInt(a.hall_name?.match(/\d+/)?.[0] || 0, 10);
                  const numB = parseInt(b.hall_name?.match(/\d+/)?.[0] || 0, 10);
                  return numA - numB;
                })
                .map((hall, index) => (
                  <li key={hall.id ?? `${hall.hall_name}-${index}`} className="seance-list-item">
                    <p>{hall.hall_name}</p>
                    <DroppableTimeline
                      hall={hall}
                      filmsInHall={placements[hall.id] || []}
                      onDropFilm={handleDropFilm}
                      onDraggingChange={setIsDraggingFilm} 
                    />
                  </li>
                ))}
          </ul>
        </div>
      </div>
      <div className="config-seats-confirm-buttons">
        <Button type="button" onClick={handleCancelAll} className="config-seats-confirm-button cancel">Отмена</Button>
        <Button type="button" onClick={handleSaveAll} className="config-seats-confirm-button save">Сохранить</Button>
      </div>
    </DndProvider>
  );
}