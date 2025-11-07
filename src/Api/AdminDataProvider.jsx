import { getAllData } from "./allData"
import { createContext, useState, useEffect, useContext } from "react";

const AdminDataContext = createContext();
export default function AdminDataProvider({ children }) {
    const [films, setFilms] = useState([]);
    const [halls, setHalls] = useState([]);
    const [seances, setSeances] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllData()
        .then((data) => {
            setFilms(data.films);
            setHalls(data.halls);
            setSeances(data.seances);
        })
        .catch((err) => {
            console.error("Ошибка загрузки:", err);
            setError(err);
        });
    }, []);

    const contextValue = {
        films,
        halls,
        seances,
        error
    };

    return (
        <AdminDataContext.Provider value={contextValue}>
            {children}
        </AdminDataContext.Provider>
    );
}

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (context === undefined) {
        throw new Error("Ошибка!");
    }
    return context;
};

