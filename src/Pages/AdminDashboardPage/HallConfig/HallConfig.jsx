import arrow from "/src/assets/admin-dashboard-arrow.png";
import '../HallConfig/HallConfig.css';
import { useState, useEffect } from "react";
import useAllData from "../../../Api/useAllData";
import Button from "../../../Components/Button";

export default function HallConfig() {
    const { halls: initialHalls = [] } = useAllData();
    const [halls, setHalls] = useState([]);
    const [selected, setSelected] = useState(false);
    const [selectedHallId, setSelectedHallId] = useState(null);

    useEffect(() => {
        if (initialHalls) {
            setHalls(initialHalls);
        }
    } , [initialHalls]);

    return (
        <div className="dashboard_hall-config">
            <div className="dashboard-header-wrap">
                <h2 className="dashboard-header">Конфигурация залов</h2>
                <img src={arrow} alt="arrow" className="dashboard-header-arrow"/>
            </div>
            <div className="dashboard-hall-info">
                <p className="additional-info">Выберите зал для конфигурации:</p>
                <ul className="hall-config-list">
                    {Array.isArray(halls) && halls.map(hall => (
                        <li key={hall.id} className="hall-config-list-item">
                            <Button
                            className={`hall-config-button ${selectedHallId === hall.id ? "selected" : ""}`}
                            onClick={() => setSelectedHallId(hall.id)}
                            >{hall.hall_name}
                            </Button>
                         </li>
                    ))}
                </ul>
                <p className="additional-info">Укажите количество рядов и максимальное количество кресел в ряду:</p>
            </div>
        </div>
    )
}