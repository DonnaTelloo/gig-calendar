import {Outlet} from "react-router";

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <aside>Sidebar</aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
}