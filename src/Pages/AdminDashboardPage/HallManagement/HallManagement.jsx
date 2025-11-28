import Button from "../../../Components/Button";
import arrow from "/src/assets/admin-dashboard-arrow.png";
import deleteBin from '/src/assets/delete-bin.png';
import { addHall } from "../../../Api/addhall";
import { useState } from "react";
import { useAdminData } from "../../../Api/AdminDataProvider";
import deleteHall from "../../../Api/deleteHall";
import CollapsibleBlock from "../../../Components/CollapsibleBlock";

export default function HallManagement() {
    const { halls, setHalls } = useAdminData();
    const [newHallName, setNewHallName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    
    const handleAddClick = () => {
        setIsAdding(true);
    }
        
    const handleSaveClick = async () => {
        if(!newHallName.trim()) return alert("Введите название зала");
    
        const data = await addHall(newHallName);

        if (data?.hall) {
            setHalls(prev => [...prev, data.hall]);
        } else if (data?.halls) {
            setHalls(data.halls);
        } else {
            const newHall = { id: Date.now(), hall_name: newHallName };
            setHalls(prev => [...prev, newHall]);
        }
            
        setNewHallName('');
        setIsAdding(false);
    }
    
    const handleCancelClick = () => {
        setIsAdding(false);
        setNewHallName("");
    }
    
    const handleDeleteClick = async (hallId) => {
        try {
            await deleteHall(hallId);
                setHalls(prev => prev.filter(hall => hall.id !== hallId));
        } catch (error) {
            alert("Не удалось удалить зал. Попробуйте снова.");
        }
    };

    return (
        <div className="dashboard_hall-management">
            <CollapsibleBlock title='Управление залами'>
            <div className="dashboard-hall-info">
                <p className="additional-info">Доступные залы:</p>
                <ul className="hall-management-list">
                    {Array.isArray(halls) && halls
                    .slice()
                    .sort((a, b) => {
                        const numA = parseInt(a.hall_name?.match(/\d+/)?.[0] || 0, 10);
                        const numB = parseInt(b.hall_name?.match(/\d+/)?.[0] || 0, 10);
                        return numA - numB;})
                    .map((hall, index) => (
                        <li key={hall.id ?? `${hall.hall_name}-${index}`} className="hall-management-list-item">{hall.hall_name}
                            <Button 
                            onClick={() => handleDeleteClick(hall.id)}
                            className="hall-delete-button">
                                <img src={deleteBin} alt="удалить" className="delete-bin-img"/>
                            </Button>
                        </li>
                    ))}
                </ul>
                {!isAdding ? 
                (<Button type="button" onClick={handleAddClick} className='hall-management-button'>Создать зал</Button>) : 
                (<div className="popup-overlay">
                    <div className="hall-management-add-hall-form">
                        <div className="dashboard-header-wrap pop-up">
                            <h2 className="dashboard-header">Добавление Зала</h2>
                            <img src="/src/assets/cross.png" alt="close" className="pop-up-cross" onClick={handleCancelClick}/>
                        </div>
                        <div className="hall-management-new-hall">
                            <div className="hall-management_new-hall-list">
                                <label htmlFor="hall-management-list-name" className="hall-management-list-label">Название зала</label>
                                <input 
                                    type="text"
                                    id="hall-management-list-name"
                                    className="hall-management-list-input"
                                    value={newHallName}
                                    onChange={e => setNewHallName(e.target.value)}
                                    placeholder="Например, «Зал 1»"
                                />
                            </div>
                            <div className="hall-management-button-wrap">
                                <Button type="button" onClick={handleSaveClick}className='hall-management-button'>Добавить зал</Button>
                                <Button type="button" onClick={handleCancelClick} className='hall-management-button cancel'>Отменить</Button>
                            </div>
                        </div>
                    </div>
                </div>)
                }
            </div>
            </CollapsibleBlock>
        </div>
    )
}   
