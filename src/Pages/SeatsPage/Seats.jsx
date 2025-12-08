import React, { useEffect, useState } from "react";
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";

export default function Seats({ seance, hall, date }) {
  const { selectedSeats, setSelectedSeats } = useSelectedSeats();
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);

  const ticketDate = date;

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);

      const res = await fetch(
        `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seance.id}&date=${ticketDate}`,
        { cache: "no-store" }
      );

      const json = await res.json();

      const cfg = Array.isArray(json)
        ? json
        : Array.isArray(json.result)
        ? json.result
        : [];

      setSeatMap(cfg);
      setSelectedSeats([]);
      setLoading(false);
    }

    loadConfig();
  }, [seance.id, date, setSelectedSeats]);

  const toggleSeat = (rowIndex, seatIndex) => {
    const seatType = seatMap[rowIndex][seatIndex];

    if (seatType === "taken" || seatType === "disabled") return;

    const key = `${rowIndex}-${seatIndex}`;
    const seatObj = {
      key,
      row: rowIndex,
      seat: seatIndex,
      type: seatType,
    };

    setSelectedSeats((prev) => {
      if (prev.some((s) => s.key === key)) {
        return prev.filter((s) => s.key !== key);
      }
      return [...prev, seatObj];
    });
  };

  if (loading) return <p>Загрузка мест...</p>;

  return (
    <div className="buying-scheme">
      <div className="buying-scheme__wrapper">
        {seatMap.map((row, rowIndex) => (
          <div key={rowIndex} className="buying-scheme__row">
            {row.map((seatType, seatIndex) => {
              if (seatType === "disabled")
              return <div key={seatIndex} className="empty-seat" />;

              const key = `${rowIndex}-${seatIndex}`;
              const isTaken = seatType === "taken";
              const isSelected = !isTaken && selectedSeats.some((s) => s.key === key);

              let seatClass = "buying-scheme__chair";

              if (seatType === "standart") {
                seatClass += " open";
              }
              if (seatType === "vip") {
                seatClass += " vip";
              }
              if (isTaken) {
                seatClass += " closed";
              }
              if (isSelected) {
                seatClass += " selected";
              }

              return (
                <button
                  key={seatIndex}
                  className={seatClass}
                  disabled={isTaken}
                  onClick={() => toggleSeat(rowIndex, seatIndex)}
                ></button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="buying-scheme__legend">
        <div className="buying-scheme__legend-price">
          <div className="status">
            <button className="buying-scheme__chair open"></button>
            <p className="buying-scheme__legend-text">
              Свободно ({hall.hall_price_standart}руб)
            </p>
          </div>
          <div className="status">
            <button className="buying-scheme__chair vip"></button>
            <p className="buying-scheme__legend-text">
              Свободно VIP ({hall.hall_price_vip}руб)
            </p>
          </div>
        </div>

        <div className="buying-scheme__legend-price">
          <div className="status">
            <button className="buying-scheme__chair closed"></button>
            <p className="buying-scheme__legend-text">Занято</p>
          </div>
          <div className="status">
            <button className="buying-scheme__chair selected"></button>
            <p className="buying-scheme__legend-text">Выбрано</p>
          </div>
        </div>
      </div>
    </div>
  );
}