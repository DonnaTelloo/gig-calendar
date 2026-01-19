import PublicRoutes from "./public.routes";
import DashboardRoutes from "./dashboard.routes";
import ProtectedRoute from "./protected.routes";
import {Route, Routes } from "react-router";

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<PublicRoutes />} />

            {/* PROTECTED */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<>Not Found</>} />
        </Routes>
    );
}
