import PublicRoutes from "./public.routes";
import DashboardRoutes from "./dashboard.routes";
import ProtectedRoute from "./protected.routes";
import {Route, Routes} from "react-router";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/*" element={<PublicRoutes />} />

            {/* Protected Dashboard */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
            </Route>

            <Route path="*" element={<>Not Found</>} />
        </Routes>
    );
}
