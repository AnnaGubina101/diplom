import { createContext, useState, useContext } from "react";

const SelectedSeatsContext = createContext();

export function SelectedSeatsProvider({ children }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    return (
        <SelectedSeatsContext.Provider value={{ selectedSeats, setSelectedSeats }}>
            {children}
        </SelectedSeatsContext.Provider>
    );
}

export function useSelectedSeats() {
    return useContext(SelectedSeatsContext);
}