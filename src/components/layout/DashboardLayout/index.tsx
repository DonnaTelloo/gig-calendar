import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Divider,
    Typography,
    Button
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { NavLink, Outlet } from "react-router";
import styles from "./index.module.css";

const drawerWidth = 240;

export default function DashboardLayout() {
    return (
        <div className={styles.dashboardLayout}>
            <aside>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
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
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>

                        <ListItemButton component={NavLink} to="/dashboard/posts">
                            <ListItemIcon>
                                <ArticleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Posts" />
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
    );
}
