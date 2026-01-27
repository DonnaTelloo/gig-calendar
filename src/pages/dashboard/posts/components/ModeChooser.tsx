import {Box, Button} from "@mui/material";

const ModeChooser = ({ onSearch, onCreate }: any) => {
    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Button variant="contained" size="large" onClick={onSearch}>
                პოსტის მოძებნა თარიღით
            </Button>
            <Button variant="outlined" size="large" onClick={onCreate}>
                ახალი პოსტის შექმნა
            </Button>
        </Box>
    );
}

export default ModeChooser;