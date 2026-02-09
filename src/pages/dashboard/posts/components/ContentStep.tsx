import {Box, Button, Typography, Divider} from "@mui/material";
import {useEffect, useState} from "react";
import ImageDropzone from "../../../../components/common/ImageDropzone";

function ContentStep({
                         kaImage, setKaImage,
                         enImage, setEnImage,
                         onBack, onSubmit, loading
                     }: any) {
    const valid = kaImage && enImage;

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            {/* Georgian Image Upload */}
            <Typography variant="h6">ქართული სურათი (KA)</Typography>
            <Box sx={{ my: 2 }}>
                <ImageDropzone
                    onImageChange={(file) => setKaImage(file)}
                    label="ატვირთეთ ქართული სურათი"
                />
            </Box>

            <Divider />

            {/* English Image Upload */}
            <Typography variant="h6">ინგლისური სურათი (EN)</Typography>
            <Box sx={{ my: 2 }}>
                <ImageDropzone
                    onImageChange={(file) => setEnImage(file)}
                    label="Upload English image"
                />
            </Box>

            <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={onBack}>უკან</Button>
                <Button
                    variant="contained"
                    disabled={!valid || loading}
                    onClick={onSubmit}
                >
                    დამატება
                </Button>
            </Box>
        </Box>
    );
}

export default ContentStep;
