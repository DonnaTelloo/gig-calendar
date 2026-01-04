import { Routes, Route } from "react-router";
import PublicLayout from "../components/layout/PublicLayout";
import Home from "../pages/home";

// Pages


export default function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route path="*" element={<>Not Found</>} />
        </Routes>
    );
}
