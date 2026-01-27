import { lazy } from "react";
import { Route, useParams } from "react-router-dom";
import { CalendarProvider } from "../context";

// Lazy load components
const DashboardLayout = lazy(() => import("../components/layout/DashboardLayout"));
const DashboardPage = lazy(() => import("../pages/dashboard"));
const PostsPage = lazy(() => import("../pages/dashboard/posts"));
const CreatePostPage = lazy(() => import("../pages/dashboard/posts/pages/create"));
const SearchArticle = lazy(() => import("../pages/dashboard/posts/pages/search"));

/**
 * Provider component that wraps dashboard layout with calendar context
 */
const DashboardProvider = () => {
    const { date } = useParams<{ date?: string }>();

    return (
        <CalendarProvider initialDate={date}>
            <DashboardLayout />
        </CalendarProvider>
    );
};

/**
 * Dashboard routes configuration with lazy loading
 */
export const dashboardRoutes = (
    <Route path="dashboard">
        <Route element={<DashboardProvider />}>
            <Route index element={<DashboardPage />} />

            <Route path="posts">
                <Route index element={<PostsPage />} />
                <Route path="create" element={<CreatePostPage />} />
                <Route path="search" element={<SearchArticle />} />
            </Route>
        </Route>
    </Route>
);
