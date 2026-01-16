import {Route, Routes} from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function DashboardRoutes() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<p>index</p>} />
                <Route path="settings" element={<p>settings</p>}/>
            </Route>
        </Routes>
    );
}