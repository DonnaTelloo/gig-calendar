import { lazy } from "react";
import { Route, useParams } from "react-router-dom";
import { CalendarProvider } from "../context";

// Lazy load components
const PublicLayout = lazy(() => import("../components/layout/PublicLayout"));
const Home = lazy(() => import("../pages/home"));

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
