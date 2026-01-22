import { Routes, Route } from "react-router";
import { publicRoutes } from "./public.routes";
import { dashboardRoutes } from "./dashboard.routes";
import ProtectedRoute from "./protected.routes";

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC */}
            {publicRoutes}

            {/* PROTECTED */}
            <Route element={<ProtectedRoute />}>
                {dashboardRoutes}
            </Route>

            {/* 404 */}
            <Route path="*" element={<>Not Found</>} />
        </Routes>
    );
}
