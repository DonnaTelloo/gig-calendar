import { lazy } from "react";
import { Route, useParams } from "react-router-dom";
import { CalendarProvider } from "../context";
import Home from "../pages/home";

// Lazy load components
const PublicLayout = lazy(() => import("../components/layout/PublicLayout"));

/**
 * Provider component that wraps public layout with calendar context
 */
const VaderProvider = () => {
    const { date } = useParams<{ date?: string }>();

    return (
        <CalendarProvider initialDate={date}>
            <PublicLayout />
        </CalendarProvider>
    );
};

/**
 * Public routes configuration with lazy loading
 */
export const publicRoutes = (
    <Route>
        <Route element={<VaderProvider />}>
            <Route index element={<Home />} />
            <Route path=":date" element={<Home />} />
        </Route>
    </Route>
);
