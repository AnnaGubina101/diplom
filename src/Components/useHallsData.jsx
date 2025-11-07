import { useEffect, useState } from "react";
import { useAdminData } from "../Api/AdminDataProvider";

export default function useHallsData() {
    const { halls: initialHalls = [] } = useAdminData();
    const [halls, setHalls] = useState([]);

    useEffect(() => {
        if (initialHalls) {
        setHalls(initialHalls);
        }
    }, [initialHalls]);

    return { halls, setHalls };
}