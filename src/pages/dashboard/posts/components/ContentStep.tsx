import {Box, Button, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";

function ContentStep({
                         titleKa, setTitleKa,
                         descriptionKa, setDescriptionKa,
                         titleEn, setTitleEn,
                         descriptionEn, setDescriptionEn,
                         image, setImage,
                         onBack, onSubmit, loading
                     }: any) {
    const valid =
        titleKa && descriptionKa && titleEn && descriptionEn;

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h6">ქართული</Typography>

            <TextField label="სათაური (KA)" value={titleKa}
                       onChange={(e) => setTitleKa(e.target.value)} />

            <TextField label="აღწერა (KA)" multiline rows={4}
                       value={descriptionKa}
                       onChange={(e) => setDescriptionKa(e.target.value)} />

            <Typography variant="h6">English</Typography>

            <TextField label="Title (EN)" value={titleEn}
                       onChange={(e) => setTitleEn(e.target.value)} />

            <TextField label="Description (EN)" multiline rows={4}
                       value={descriptionEn}
                       onChange={(e) => setDescriptionEn(e.target.value)} />

            <Button variant="outlined" component="label">
                ატვირთე სურათი
                <input hidden type="file"
                       onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </Button>

            {preview && (
                <Box mt={2} display="flex" justifyContent="center">
                    <Box
                        component="img"
                        src={preview}
                        alt="Preview"
                        sx={{
                            maxWidth: "100%",
                            maxHeight: 300,
                            borderRadius: 2,
                            border: "1px solid #ddd",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            )}

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