import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "./public.routes";
import { dashboardRoutes } from "./dashboard.routes";
import PageLoader from "../components/common/PageLoader/index";

// Lazy load the protected route component
const ProtectedRoute = lazy(() => import("./protected.routes"));

// Not found component
const NotFound = () => <div>Page Not Found</div>;
const Auth = lazy(() => import("../pages/auth"));

/**
 * Main application routes
 */
export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* PUBLIC */}
                {publicRoutes}

                {/* AUTH */}
                <Route path="auth" element={<Auth />} />

                {/* PROTECTED */}
                <Route element={<ProtectedRoute />}>
                    {dashboardRoutes}
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
