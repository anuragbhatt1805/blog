import { useEffect, useState } from "react";
import { initialState } from "../redux/Slice";

export const useUser = (userId) => {
    const [user, setUser] = useState({})

    useEffect(() => {
        setUser(initialState.user)
    }, [])

    return user
}