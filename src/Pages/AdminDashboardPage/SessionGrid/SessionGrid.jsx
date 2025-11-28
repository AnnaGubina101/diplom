import Button from "../../../Components/Button";
import arrow from "/src/assets/admin-dashboard-arrow.png";
import { useState, useEffect, useRef } from "react";
import { addMovie } from "../../../Api/addMovie";
import { useAdminData } from "../../../Api/AdminDataProvider";
import Timeline from "./Timeline";
import CollapsibleBlock from "../../../Components/CollapsibleBlock";

export default function SessionGrid() {
    const [isAdding, setIsAdding] = useState(false);

    const [filmName, setFilmName] = useState("");
    const [filmDuration, setFilmDuration] = useState("");
    const [filmDescription, setFilmDescription] = useState("");
    const [filmOrigin, setFilmOrigin] = useState("");
    const [filePoster, setFilePoster] = useState(null);
    const fileInputRef = useRef(null);

    const { halls, films, setFilms } = useAdminData();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            alert("Файл не должен превышать 3 МБ");
            e.target.value = "";
            return;
        }

        if (file.type !== "image/png") {
            alert("Файл должен быть в формате PNG");
            e.target.value = "";
            return;
        }

        setFilePoster(file);
    };

    const handleAddClick = () => {
        setIsAdding(true);
    }

    const handleSaveClick = async () => {
        if (!filmName || !filmDuration || !filePoster) {
            return alert("Заполните все поля и выберите постер");
        }

        try {
            const result = await addMovie({
                filmName,
                filmDuration: Number(filmDuration),
                filmDescription,
                filmOrigin,
                filePoster
            });

            console.log(result)

            if (result.success && result.result?.newFilm) {
                setFilms(prev => [...prev, result.result.newFilm]);
            }

            setIsAdding(false);
            setFilmName("");
            setFilmDuration("");
            setFilmOrigin("");
            setFilmDescription("");
            setFilePoster(null);

            return alert("Фильм успешно добавлен!");
        } catch (error) {
            console.error(error);
            return alert(`Ошибка: ${error}`);
        }
    };

    const handleCancelClick = () => {
        setIsAdding(false);
    }

    return (
        <div className="dashboard_hall-management">
            <CollapsibleBlock title='Сетка сеансов'>
            <div className="dashboard-hall-info">
                {!isAdding ? (<Button className="session-grid-add-film-button" onClick={handleAddClick}
                >Добавить фильм</Button>) : 
                (<div className="popup-overlay">
                    <div className="session-grid-add-popup-form movie">
                        <div className="dashboard-header-wrap pop-up">
                            <h2 className="dashboard-header">Добавление фильма</h2>
                            <img src="/src/assets/cross.png" alt="close" className="pop-up-cross" onClick={handleCancelClick}/>
                        </div>
                        <div className="session-grid-new-item">
                            <div className="session-grid-new-item-list">
                                <div className="session-grid-list-wrap">
                                    <label htmlFor="session-grid-list-name" className="session-grid-list-label">Название фильма</label>
                                    <input 
                                        type="text"
                                        id="session-grid-list-name"
                                        className="session-grid-list-input"
                                        value={filmName}
                                        onChange={e => setFilmName(e.target.value)}
                                        placeholder="Например, «Гражданин Кейн»"
                                    />
                                </div>
                                <div className="session-grid-list-wrap">
                                    <label htmlFor="session-grid-list-duration" className="session-grid-list-label">Продолжительность фильма (мин.)</label>
                                    <input 
                                        type="text"
                                        id="session-grid-list-duration"
                                        className="session-grid-list-input"
                                        value={filmDuration}
                                        onChange={e => setFilmDuration(e.target.value)}
                                    />
                                </div>
                                <div className="session-grid-list-wrap">
                                    <label htmlFor="session-grid-list-description" className="session-grid-list-label description">Описание фильма</label>
                                    <input 
                                        type="text"
                                        id="session-grid-list-description"
                                        className="session-grid-list-input description"
                                        value={filmDescription}
                                        onChange={e => setFilmDescription(e.target.value)}
                                    />
                                </div>
                                <div className="session-grid-list-wrap">
                                    <label htmlFor="session-grid-list-country" className="session-grid-list-label">Страна</label>
                                    <input 
                                        type="text"
                                        id="session-grid-list-country"
                                        className="session-grid-list-input"
                                        value={filmOrigin}
                                        onChange={e => setFilmOrigin(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="session-grid-pop-up-buttons">
                                <Button type="button" onClick={handleSaveClick} className="session-grid-button">Добавить фильм</Button>
                                <Button type="button" onClick={() => fileInputRef.current.click()} className="session-grid-button">Загрузить постер</Button>
                                <input
                                ref={fileInputRef}
                                id="filePoster"
                                type="file"
                                accept="image/png"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                />
                                <Button type="button" onClick={handleCancelClick} className="session-grid-button cancel">Отменить</Button>
                            </div>
                        </div>
                    </div>
                </div>)
                }
               <Timeline halls={halls} films={films} />
            </div>
            </CollapsibleBlock>
        </div>
    )
}