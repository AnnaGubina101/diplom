import arrow from "/src/assets/admin-dashboard-arrow.png";
import { useAdminData } from "../../../Api/AdminDataProvider";
import { useState, useEffect } from "react";
import Button from "../../../Components/Button";
import { openHallSales } from '../../../Api/openHallSales'
import CollapsibleBlock from "../../../Components/CollapsibleBlock";


export default function OpenSales() {
    const { halls, setHalls } = useAdminData();
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (halls.length > 0 && selectedHallId === null) {
            const sorted = halls
            .slice()
            .sort((a, b) => {
                const numA = parseInt(a.hall_name.match(/\d+/)?.[0] || 0, 10);
                const numB = parseInt(b.hall_name.match(/\d+/)?.[0] || 0, 10);
                return numA - numB;
            });
    
            setSelectedHallId(sorted[0].id);
        }
    }, [halls, selectedHallId]);

    const selectedHall = halls.find(h => String(h.id) === String(selectedHallId));

    const handleToggleSales = async () => {
        if (!selectedHall) return;
        setLoading(true);

         try {
            const newOpenState = Number(selectedHall.hall_open) === 0 ? 1 : 0;
            const response = await openHallSales(selectedHall.id, newOpenState);

            if (response.success) {
                setHalls(prev =>
                prev.map(h =>
                    String(h.id) === String(selectedHall.id) ? response.result : h
                )
            );
            } else {
                alert(`Ошибка: ${response.error}`);
            }

             window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Ошибка при изменении статуса продаж.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="dashboard_hall-management">
                <CollapsibleBlock title='Открыть продажи'>
                <div className="dashboard-hall-info">
                    <p className="additional-info">Выбирите зал для открытия/закрытия продаж:</p>
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
                    <div className="open-sales-button-wrap">
                        <p className="additional-info">Всё готово к открытию</p>
                        {selectedHall ? (
                            <Button
                            className="open-sales-button"
                            onClick={handleToggleSales}
                            disabled={loading}
                            >
                            {selectedHall.hall_open === 0
                            ? "Открыть продажу билетов"
                            : "Приостановить продажу билетов"}
                            </Button>
                        ) : (
                            <p>Выберите зал</p>
                        )}
                    </div>
                </div>
                </CollapsibleBlock>
            </div>
        </>
    )
}