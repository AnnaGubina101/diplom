import Button from "../../../Components/Button"
import arrow from "/src/assets/admin-dashboard-arrow.png";
import deleteBin from '/src/assets/delete-bin.png';
import { addHall } from "../../../Api/addhall";
import { useState, useEffect } from "react";
import useAllData from "../../../Api/useAllData";
import deleteHall from "../../../Api/deleteHall";

export default function HallManagement() {

    const { halls: initialHalls = [] } = useAllData();
    const [newHallName, setNewHallName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [halls, setHalls] = useState([]);
    
    useEffect(() => {
        if (initialHalls) {
            setHalls(initialHalls);
        }
    } , [initialHalls]);
    
    const handleAddClick = () => {
        setIsAdding(true);
        console.log("клик по кнопке, isAdding было:", isAdding);
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
            <div className="dashboard-header-wrap">
                <h2 className="dashboard-header">Управление залами</h2>
                <img src={arrow} alt="arrow" className="dashboard-header-arrow"/>
            </div>
            <div className="dashboard-hall-info">
                <p className="additional-info">Доступные залы:</p>
                <ul className="hall-management-list">
                    {Array.isArray(halls) && halls.map(hall => (
                        <li key={hall.id} className="hall-management-list-item">{hall.hall_name}
                            <Button 
                            onClick={() => handleDeleteClick(hall.id)}
                            className="hall-management-button hall-delete-button">
                                <img src={deleteBin} alt="удалить" className="delete-bin-img"/>
                            </Button>
                        </li>
                    ))}
                </ul>
                {!isAdding ? 
                (<Button type="button" onClick={handleAddClick} className='hall-management-button'>Создать зал</Button>) : 
                (<div className="hall-management-add-hall-form">
                    <input 
                        type="text"
                        className="hall-management-list-name"
                        value={newHallName}
                        onChange={e => setNewHallName(e.target.value)}
                        placeholder="Введите название зала"
                    />
                    <Button type="button" onClick={handleSaveClick}className='hall-management-button'>Сохранить</Button>
                    <Button type="button" onClick={handleCancelClick} className='hall-management-button'>Отменить</Button>
                </div>)
                }
        </div>
            </div>
    )
}