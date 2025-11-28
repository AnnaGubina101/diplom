import Button from "../../../Components/Button";
import arrow from "/src/assets/admin-dashboard-arrow.png";
import { useAdminData } from '../../../Api/AdminDataProvider'
import { useState, useEffect } from "react";
import { updatePriceConfig } from "../../../Api/updatePriceConfig";
import CollapsibleBlock from "../../../Components/CollapsibleBlock";

export default function PriceConfig() {
    const { halls, setHalls } = useAdminData();
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [priceStandart, setPriceStandart] = useState('');
    const [priceVip, setPriceVip] = useState('');

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
        if(selectedHallId) {
            const selected = halls.find((hall) => hall.id === selectedHallId);
            if(selected) {
                setPriceStandart(selected.hall_price_standart || "");
                setPriceVip(selected.hall_price_vip || "");
            }
        }
    }, [selectedHallId, halls]);

    const handleSaveButton = async () => {
        if (!selectedHallId) {
            return alert("Выберите зал перед сохранением.");
        }

        try {
            const updated = await updatePriceConfig(
                selectedHallId,
                priceStandart,
                priceVip
            );

            setHalls((prev) =>
                prev.map((hall) =>
                hall.id === selectedHallId
                    ? {
                        ...hall,
                        hall_price_standart: updated.hall_price_standart,
                        hall_price_vip: updated.hall_price_vip,
                    }
                    : hall
                )
            );

            return alert("Цены успешно обновлены!");
            } catch (error) {
            console.error(error);
            return alert("Ошибка при сохранении цен.");
            }

        }

   return (
    <div className="dashboard_hall-management">
        <CollapsibleBlock title='Конфигурация цен'>
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
            <p className="additional-info">Установите цены для типов кресел:</p>
            <div className="price-config-seats-price-wrap">
                <div className="price-config-seats-price">
                    <label htmlFor="seats-standart" className="admin-config-seats-additional">Цена, рублей</label>
                    <input 
                    type="text"
                    id="seats-standart" 
                    className="admin-config-seats-input"
                    value={priceStandart}
                    onChange={(e) => setPriceStandart(e.target.value)}
                    />
                </div>
                <p className="additional-info price-config">за <button className="admin-config-seat standart"></button> обычные кресла</p>
            </div>
            <div className="price-config-seats-price-wrap">
                <div className="price-config-seats-price">
                    <label htmlFor="seats-vip" className="admin-config-seats-additional">Цена, рублей</label>
                    <input 
                    type="text"
                    id="seats-vip" 
                    className="admin-config-seats-input"
                    value={priceVip}
                    onChange={(e) => setPriceVip(e.target.value)}
                    />
                </div>
                <p className="additional-info price-config">за <button className="admin-config-seat vip"></button> VIP кресла</p>
            </div>
            <div className="config-seats-confirm-buttons">
                <Button 
                    className="config-seats-confirm-button cancel"
                    type="button"
                    onClick={() => {
                        setPriceStandart("");
                        setPriceVip("");
                        setSelectedHallId(null);
                    }}
                >Отмена</Button>
                <Button 
                    className="config-seats-confirm-button save"
                    type="button"
                    onClick={handleSaveButton}
                >Сохранить</Button>
            </div>
        </div>
        </CollapsibleBlock>
    </div>
   )
}