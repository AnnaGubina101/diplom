import arrowDown from "/src/assets/admin-dashboard-arrow.png";
import arrowUp from "/src/assets/admin-dashboard-arrow-up.png";
import { useState } from "react";

export default function CollapsibleBlock({ title, children }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <>
        <div className="dashboard-header-wrap circle">
            <div className="circles"></div>
            <h2 className="dashboard-header">{title}</h2>
            <img
                src={isOpen ? arrowUp : arrowDown}
                alt="arrow"
                className="dashboard-header-arrow"
                onClick={toggleOpen}
            />
        </div>
        {isOpen && (
            <div className="dashboard-hall-info" style={{ padding: "10px 0" }}>
            {children}
            </div>
        )}
        </>
    )
}