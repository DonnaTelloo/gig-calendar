import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Button
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { NavLink, Outlet } from "react-router";
import styles from "./index.module.css";
import { useState, useEffect } from "react";
import { useCalendarContext } from "../../../context";
import PageLoader from "../../common/PageLoader";

export default function DashboardLayout() {
    const [showLoader, setShowLoader] = useState(false);
    const { isLoading } = useCalendarContext();

    useEffect(() => {
        document.body.style.setProperty('overflow-y', 'scroll', 'important');
        document.body.style.setProperty('overflow-x', 'hidden', 'important');
    }, []);

    // Update loader state when isLoading changes
    useEffect(() => {
        if (isLoading) {
            setShowLoader(true);
        } else {
            // Small delay to prevent flickering for quick operations
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <>
            {showLoader && <PageLoader />}
            <div className={styles.dashboardLayout}>
                <aside>
                    <Drawer
                        variant="permanent"
                        sx={{
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: "250px",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column"
                            }
                        }}
                    >
                        <Toolbar />

                        {/* TOP NAV */}
                        <List>
                            <ListItemButton component={NavLink} to="/dashboard">
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="დეშბორდი" />
                            </ListItemButton>

                            <ListItemButton component={NavLink} to="/dashboard/posts">
                                <ListItemIcon>
                                    <ArticleIcon />
                                </ListItemIcon>
                                <ListItemText primary="კონტენტი" />
                            </ListItemButton>
                        </List>

                        {/* PUSH TO BOTTOM */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* WEBSITE PREVIEW */}
                        <Box sx={{ p: 2 }}>

                            <Button
                                component={NavLink}
                                to="/"
                                size="small"
                                fullWidth
                                endIcon={<OpenInNewIcon />}
                                sx={{ mt: 1 }}
                            >
                                View site
                            </Button>
                        </Box>
                    </Drawer>
                </aside>

                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </>
    );
}
