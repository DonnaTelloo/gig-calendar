import { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import { login } from "../../api/auth.api";
import Swal from "sweetalert2";
import { isAuthenticated } from "../../services/auth.service";
import { navigateToDashboard } from "../../services/navigation.service";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    // Check authentication status
    useEffect(() => {
        const authStatus = isAuthenticated();
        setIsUserAuthenticated(authStatus);
        setIsAuthChecked(true);
    }, []);

    // Immediately redirect if authenticated
    if (isAuthChecked && isUserAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Don't render anything until auth check is complete
    if (!isAuthChecked) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                title: 'Error!',
                text: 'Email and password are required',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            setLoading(true);

            const response = await login({
                email,
                password,
            });

            if (response && response.token) {
                window.location.href = '/dashboard';
            } else {
                Swal.fire({
                    title: 'Authentication Failed',
                    text: "Login failed. No valid token received.",
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (err: any) {
            console.error(err);
            Swal.fire({
                title: 'Authentication Failed',
                text: err.message || "Login failed. Please try again.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={3} sx={{ p: 4, width: 360 }}>
                <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
                    ავტორიზაცია
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="ელ-ფოსტა"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <TextField
                        label="პაროლი"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? "პროცესი მიდის..." : "ავტორიზაცია"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
