import { Routes, Route } from "react-router";
import PublicLayout from "../components/Layout/PublicLayout";

// Pages
import HomePage from "../pages/HomePage";
// HomePage now contains: Left selector + Timeline posts


export default function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                {/*<Route path="/posts/:id" element={<PostDetailPage />} />*/}
                {/*<Route path="*" element={<NotFoundPage />} />*/}
            </Route>
        </Routes>
    );
}
