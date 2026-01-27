import {
    Box,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PostsPage() {
    const navigate = useNavigate();

    return (
        <Box p={4} maxWidth={600}>
            <Typography variant="h4" mb={3}>
                პოსტები
            </Typography>

            <Stack direction="row" spacing={2}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("search")}
                >
                    ძებნა თარიღით
                </Button>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("create")}
                >
                    ახალი ივენთის შექმნა
                </Button>
            </Stack>
        </Box>
    );
}
