import { useState, useRef } from "react";

export const generateGates = (daysCount = 7) => {
    const days = [];
    const today = new Date();

    for(let i = 0; i < daysCount; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() +i);

        const day = date.toLocaleDateString("ru-RU", { weekday: "short" });
        const dayNumber = date.getDate();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        days.push({
            label: i === 0 ? "Сегодня" : null,
            day,
            date: dayNumber,
            full: date.toISOString().split("T")[0],
            isWeekend,
        })
    }

    return days
}

export default function Navigation({ days, selectedDay, setSelectedDay }) {
    const stripRef = useRef(null)

    const scrollAmount = 6 * 70;

    const scrollRight = () => {
        if (stripRef.current) {
        stripRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="index-nav">
            <div className="index-nav-days-contsiner" ref={stripRef}>
                <div className="index-nav-days">
                    {days.map((day, i) => (
                        <button key={i}
                        className={`nav-day 
                        ${day.label === "Сегодня" ? 'today': ''} 
                        ${day.isWeekend ? 'weekend' : ''} 
                        ${selectedDay.full === day.full ? "nav-selected" : ''}`}
                        onClick={() => setSelectedDay(day)}
                        >
                            <div>{day.label ? `${day.label} ${day.day}, ` : `${day.day}, `}</div>
                            <div>{day.date}</div>
                        </button>
                    ))}
                </div>
            </div>
            <button className="scroll-btn" onClick={scrollRight}>{'>'}</button>
        </div>
    )
}