import { Route } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/dashboard";
import PostsPage from "../pages/dashboard/posts";

export const dashboardRoutes = (
    <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="posts" element={<PostsPage />} />
    </Route>
);
