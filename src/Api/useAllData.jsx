import { useState, useEffect } from "react";
import { getAllData } from "./allData";

export default function useAllData() {
    const [films, setFilms] = useState([]);
    const [halls, setHalls] = useState([])
    const [seances, setSeances] = useState([])

    useEffect(() => {
        getAllData()
        .then((data) => {
            setFilms(data.films);
            setHalls(data.halls);
            setSeances(data.seances);
        })
        .catch((err) => {
            console.error("Ошибка загрузки:", err);
        });
    }, []);

    return {films, halls, seances}
}