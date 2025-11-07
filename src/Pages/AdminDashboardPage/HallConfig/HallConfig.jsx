import arrow from "/src/assets/admin-dashboard-arrow.png";
import '../HallConfig/HallConfig.css';
import { useState, useEffect } from "react";
import useHallsData from '../../../Components/useHallsData'
import Button from "../../../Components/Button";
import { updateHallConfig } from "../../../Api/updateHallConfig";

export default function HallConfig() {
    const { halls, setHalls } = useHallsData();
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [rows, setRows] = useState(0);
    const [seats, setSeats] = useState(0);
    const [seatLayout, setSeatLayout] = useState([])

    useEffect(() => {
    if (!selectedHallId) return;

    const selectedHall = halls.find(h => h.id === selectedHallId);

    if (selectedHall && selectedHall.hall_config) {
        let parsedConfig = [];
        try {
            parsedConfig = JSON.parse(selectedHall.hall_config);
        } catch {
            parsedConfig = [];
        }

        setSeatLayout(parsedConfig);
        setRows(selectedHall.hall_rows);
        setSeats(selectedHall.hall_places);
    }
}, [selectedHallId, halls]);

    useEffect(() => {
        if (seatLayout.length > 0) return;

        setSeatLayout(prev => {
            const newLayout = [];
            for (let r = 0; r < rows; r++) {
            const row = [];
            for (let s = 0; s < seats; s++) {
                row.push(prev[r]?.[s] || "standart");
            }
            newLayout.push(row);
            }
            return newLayout;
        });
    }, [rows, seats]);

    const handleSeatClick = (rowIndex, seatIndex) => {
        setSeatLayout(prev =>
            prev.map((row, rIdx) =>
                row.map((seat, sIdx) => {
                    if (rIdx === rowIndex && sIdx === seatIndex) {
                        if (seat === 'standart') return 'vip';
                        if (seat === 'vip') return 'disabled';
                        return 'standart';
                    }
                    return seat;
                })
            )
        );
    }

    const renderSeats = () => {
         return seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="hall-config-row">
                {row.map((seat, seatIndex) => {
                    return (
                        <button
                        key={`${rowIndex}-${seatIndex}`}
                        className={`admin-config-seat
                            ${seat === 'standart' ? 'standart' : ''} 
                            ${seat === 'vip' ? 'vip' : ''} 
                            ${seat === 'disabled' ? 'disabled' : ''}`}
                        onClick={() => handleSeatClick(rowIndex, seatIndex)}
                        ></button>
                    );
                })}
            </div>
        ));
    }

    const handleSaveClick = () => {
        if(!selectedHallId) {
            return alert("Выберите зал перед сохранением!")
        }

        try {
            const response = updateHallConfig(selectedHallId, rows, seats, seatLayout);
            if(response.success) {
                const updatedHall = response.result;
                setHalls(prev => prev.map(h => h.id === updatedHall.id ? updatedHall : h));
                alert(`Конфигурация зала "${response.result.hall_name}" успешно обновлена!`);
            } else {
                alert(`Ошибка: ${response.error}`);
            }
        }
        catch (err){
            alert("Произошла ошибка при сохранении конфигурации.");
        }
    }

    return (
        <div className="dashboard_hall-config">
            <div className="dashboard-header-wrap circle">
                <h2 className="dashboard-header">Конфигурация залов</h2>
                <img src={arrow} alt="arrow" className="dashboard-header-arrow"/>
            </div>
            <div className="dashboard-hall-info">
                <p className="additional-info">Выберите зал для конфигурации:</p>
                <ul className="admin-config-list">
                    {Array.isArray(halls) && halls
                    .slice()
                    .sort((a, b) => {
                        const numA = parseInt(a.hall_name.match(/\d+/)?.[0] || 0, 10);
                        const numB = parseInt(b.hall_name.match(/\d+/)?.[0] || 0, 10);
                        return numA - numB;})
                    .map(hall => (
                        <li key={hall.id} className="admin-config-list-item">
                            <Button
                            className={`admin-config-button ${selectedHallId === hall.id ? "selected" : ""}`}
                            onClick={() => setSelectedHallId(hall.id)}
                            >{hall.hall_name}
                            </Button>
                        </li>
                    ))}
                </ul>
                <p className="additional-info">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                <div className="hall-config-seats">
                    <div className="hall-config-seats-wrap">
                        <label htmlFor="seats-config-row" className="admin-config-seats-additional">Рядов, шт</label>
                        <input 
                        type="text"
                        id="seats-config-row" 
                        className="admin-config-seats-input"
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        />
                    </div>
                    <p className="admin-config-seats-additional">x</p>
                    <div className="hall-config-seats-wrap">
                        <label htmlFor="seats-config-seat" className="admin-config-seats-additional">Мест, шт</label>
                        <input 
                        type="text"
                        id="seats-config-seat"
                        className="admin-config-seats-input" 
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        />
                    </div>
                </div>
                <p className="additional-info">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="hall-config-seats-info">
                        <button className="admin-config-seat standart"></button>
                        <p className="hall-config-seats-additional info">  — обычные кресла</p>
                        <button className="admin-config-seat vip"></button>
                        <p className="hall-config-seats-additional info">  — VIP кресла</p>
                        <button className="admin-config-seat disabled"></button>
                        <p className="hall-config-seats-additional info"> — заблокированные (нет кресла)</p>
                </div>
                <p className="hall-config-seats-additional">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                <div className="hall-config-seats-screen">
                    <p className="hall-config-seats-screen-info"> экран</p>
                    <div className="hall-config-seats-screen-seats">{renderSeats()}</div>
                </div>
                <div className="config-seats-confirm-buttons">
                    <Button 
                    className="config-seats-confirm-button cancel"
                    type="button"
                    >Отмена</Button>
                    <Button 
                    className="config-seats-confirm-button save"
                    onClick={handleSaveClick}
                    type="button"
                    >Сохранить</Button>
                </div>
            </div>
        </div>
    )
}