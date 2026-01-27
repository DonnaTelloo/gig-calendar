import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export default function ProtectedRoute() {
    const [checked, setChecked] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setAuthenticated(isTokenValid(token));
        setChecked(true);
    }, []);

    // ⛔ block render until auth is checked
    if (!checked) {
        return null; // or loader/spinner
    }

    if (!authenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}
