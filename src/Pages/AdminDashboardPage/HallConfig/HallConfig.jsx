import arrow from "/src/assets/admin-dashboard-arrow.png";
import '../HallConfig/HallConfig.css';
import { useState, useEffect } from "react";
import { useAdminData } from "../../../Api/AdminDataProvider";
import Button from "../../../Components/Button";
import { updateHallConfig } from "../../../Api/updateHallConfig";
import CollapsibleBlock from "../../../Components/CollapsibleBlock";

export default function HallConfig() {
    const { halls, setHalls } = useAdminData();
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [rows, setRows] = useState(0);
    const [seats, setSeats] = useState(0);
    const [seatLayout, setSeatLayout] = useState([]);
    const [originalHallState, setOriginalHallState] = useState(null);

    useEffect(() => {
        if (halls.length > 0 && selectedHallId === null) {
            const sorted = halls
                .slice()
                .sort((a, b) => {
                    const numA = parseInt(a.hall_name?.match(/\d+/)?.[0] || 0, 10);
                    const numB = parseInt(b.hall_name?.match(/\d+/)?.[0] || 0, 10);
                    return numA - numB;
                });

            setSelectedHallId(sorted[0].id);
        }
    }, [halls, selectedHallId]);

    useEffect(() => {
        if (!selectedHallId) return;

        const selectedHall = halls.find(h => h.id === selectedHallId) || {};
        if (!selectedHall) return;

        const initialState = {
            rows: selectedHall.hall_rows,
            seats: selectedHall.hall_places,
            layout: selectedHall.hall_config
        };

        setOriginalHallState(initialState);
        setSeatLayout(initialState.layout);
        setRows(initialState.rows);
        setSeats(initialState.seats);
    }, [selectedHallId, halls]);

    useEffect(() => {
    const generateLayout = (rows, seats, prevLayout) => {
        const newLayout = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let s = 0; s < seats; s++) {
                row.push(prevLayout?.[r]?.[s] || "standart");
            }
            newLayout.push(row);
        }
        return newLayout;
        };

        setSeatLayout(prev => generateLayout(rows, seats, prev));
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

    const handleCancel = () => {
        if (!originalHallState) return;

        setRows(originalHallState.rows);
        setSeats(originalHallState.seats);
        setSeatLayout(originalHallState.layout);
    };

    const renderSeats = () => {
         if (!seatLayout || seatLayout.length === 0) return null;
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

    const handleSaveClick = async () => {
        if(!selectedHallId) {
            return alert("Выберите зал перед сохранением!")
        }

        try {
            const response = await updateHallConfig(selectedHallId, rows, seats, seatLayout);
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
        <div className="dashboard_hall-management">
            <CollapsibleBlock title='Конфигурация залов'>
            <div className="dashboard-hall-info">
                <p className="additional-info">Выберите зал для конфигурации:</p>
                <ul className="admin-config-list">
                    {Array.isArray(halls) && halls
                    .slice()
                    .sort((a, b) => {
                        const numA = parseInt(a.hall_name?.match(/\d+/)?.[0] || 0, 10);
                        const numB = parseInt(b.hall_name?.match(/\d+/)?.[0] || 0, 10);
                        return numA - numB;})
                    .map((hall, index) => (
                        <li key={hall.id ?? `${hall.hall_name}-${index}`} className="admin-config-list-item">
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
                        value={rows ?? 0}
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
                        value={seats ?? 0}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        />
                    </div>
                </div>
                <p className="additional-info">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="hall-config-seats-info">
                    <div className="hall-config-seats-btn-wrap">
                        <button className="admin-config-seat standart"></button>
                        <p className="hall-config-seats-additional info">  — обычные кресла</p>
                    </div>
                    <div className="hall-config-seats-btn-wrap">
                        <button className="admin-config-seat vip"></button>
                        <p className="hall-config-seats-additional info">  — VIP кресла</p>
                    </div>
                    <div className="hall-config-seats-btn-wrap">
                        <button className="admin-config-seat disabled"></button>
                        <p className="hall-config-seats-additional info"> — заблокированные (нет кресла)</p>
                    </div>
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
                    onClick={handleCancel}
                    >Отмена</Button>
                    <Button 
                    className="config-seats-confirm-button save"
                    onClick={handleSaveClick}
                    type="button"
                    >Сохранить</Button>
                </div>
            </div>
            </CollapsibleBlock>
        </div>
    )
}