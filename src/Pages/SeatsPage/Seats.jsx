import { useState } from "react"

export default function Seats() {
    const seatsWithFlags = buyingScheme.map(row =>
        row.map(seat => {
        if (!seat) return null;
        return {
            ...seat,
            isSelected: seat.isSelected ?? false,
            isVip: seat.isVip ?? false,
            isBooked: seat.isBooked ?? false
        };
        })
    )
    const [seats, setSeats] = useState(seatsWithFlags)

    const handleClick = (rowIndex, seatIndex) => {
        const allSeats = [...seats]
        const seat = allSeats[rowIndex][seatIndex];

        if (seat.isBooked) return;

        seat.isSelected = !seat.isSelected;
        setSeats(allSeats);
    }

    return (
        <div className="buying-scheme">
            <div className='buying-scheme__wrapper'>
                {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="buying-scheme__row">
                        {row.map((seat, seatIndex) => seat ? (
                                <button
                                    key={`${seat.row}-${seat.seat}`}
                                    className={`buying-scheme__chair 
                                        ${seat.isBooked ? 'closed' : ''}
                                        ${seat.isSelected ? 'selected' : ''}
                                        ${seat.isVip ? 'vip' : ''}`}
                                    onClick={() => handleClick(rowIndex, seatIndex)}
                                ></button>
                            ) : (<div key={`empty-${rowIndex}-${seatIndex}`} className="empty-seat"></div>))}
                        </div>
                    ))}
            </div>
            <div className="buying-scheme__legend">
                <div className="buying-scheme__legend-price">
                        <div className="status">
                            <button className="buying-scheme__chair open"></button>
                            <p className="buying-scheme__legend-text"> Свободно (250руб)</p>
                        </div>
                        <div className="status">
                            <button className="buying-scheme__chair vip"></button>
                            <p className="buying-scheme__legend-text"> Свободно VIP (350руб)</p>
                        </div>
                </div>
                <div className="buying-scheme__legend-price">
                    <div className="status">
                        <button className="buying-scheme__chair closed"></button>
                        <p className="buying-scheme__legend-text">Занято</p>
                    </div>
                    <div className="status">
                        <button className="buying-scheme__chair selected"></button>
                        <p className="buying-scheme__legend-text"> Выбрано</p>
                    </div>
                </div>
            </div>
        </div>
    )
}