import { createContext, useState, useContext } from "react";

const SelectedSeatsContext = createContext();

export function SelectedSeatsProvider({ children }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const clearSelectedSeats = () => setSelectedSeats([]);
    return (
        <SelectedSeatsContext.Provider value={{ selectedSeats, setSelectedSeats, clearSelectedSeats }}>
            {children}
        </SelectedSeatsContext.Provider>
    );
}

export function useSelectedSeats() {
    return useContext(SelectedSeatsContext);
}