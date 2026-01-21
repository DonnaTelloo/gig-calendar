import {Route, Routes} from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/dashboard";
import PostsPage from "../pages/dashboard/posts";

export default function DashboardRoutes() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="posts" element={<PostsPage />}/>
            </Route>
        </Routes>
    );
}