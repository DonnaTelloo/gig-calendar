import {Navigate, Outlet} from "react-router";

const isAuthenticated = () => {
    // replace with real logic (token, context, redux, etc.)
    return Boolean(localStorage.getItem("token"));
};

export default function ProtectedRoute() {
    console.log(Boolean(localStorage.getItem("token")));
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}