import { getAllData } from "./allData"
import { createContext, useState, useEffect, useContext } from "react";

const AdminDataContext = createContext();
export default function AdminDataProvider({ children }) {
    const [films, setFilms] = useState([]);
    const [halls, setHalls] = useState([]);
    const [seances, setSeances] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const reload = () => {
        setLoading(true);
        getAllData()
            .then((data) => {
                setFilms(data.films);
                setHalls(data.halls);
                setSeances(data.seances);
            })
            .catch((err) => {
                console.error("Ошибка загрузки:", err);
                setError(err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        reload();
    }, []);

    return (
        <AdminDataContext.Provider value={{ halls, setHalls, films, setFilms, seances, setSeances, error, loading, reload }}>
            {children}
        </AdminDataContext.Provider>
    );
}

export function useAdminData() {
    return useContext(AdminDataContext);
}

