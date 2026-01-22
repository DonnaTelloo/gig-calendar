import {Route, useParams} from "react-router";
import PublicLayout from "../components/layout/PublicLayout";
import Home from "../pages/home";
import {CalendarProvider} from "../context";

const VaderProvider = () => {
    const { date } = useParams<{ date?: string }>();

    return (
        <CalendarProvider initialDate={date}>
            <PublicLayout />
        </CalendarProvider>
    )
}

export const publicRoutes = (
    <Route element={<VaderProvider />}>
        <Route index element={<Home />} />
        <Route path=":date" element={<Home />} />
    </Route>
);
