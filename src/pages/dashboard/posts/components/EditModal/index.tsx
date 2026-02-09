import { Box, Button, Divider, Typography, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import "./style.css";
import ImageDropzone from "../../../../../components/common/ImageDropzone";
import useImage from "../../hooks/useImage";
import { getYearsApi } from "../../../../../features/calendar/api/calendar.api";

const MONTHS = [
    "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

type EditModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    editDraft: any;
    setEditDraft: (draft: any) => void;
    loading?: boolean;
};

const EditModal = ({ open, onClose, onSave, editDraft, setEditDraft, loading = false }: EditModalProps) => {
    const [years, setYears] = useState<number[]>([]);
    const [year, setYear] = useState<number | "">("");
    const [month, setMonth] = useState<number | "">("");
    const [day, setDay] = useState<number | "">("");

    const [kaImage, setKaImage] = useState<File | null>(null);
    const [enImage, setEnImage] = useState<File | null>(null);

    const { updateImage, loading: updateLoading } = useImage();

    // Load available years
    useEffect(() => {
        getYearsApi().then((res) => setYears(res));
    }, []);

    // Parse date from editDraft when it changes
    useEffect(() => {
        if (editDraft?.date) {
            const date = new Date(editDraft.date);
            setYear(date.getFullYear());
            setMonth(date.getMonth());
            setDay(date.getDate());
        }
    }, [editDraft]);

    if (!open || !editDraft) return null;

    return (
        <div className="edit-overlay">
            <div
                className="edit-modal"
            >
                <Typography variant="h6" className="modal-title">პოსტის რედაქტირება</Typography>
                <Button className="close-btn" onClick={onClose}>
                    <CloseIcon />
                </Button>

                <Box className="modal-content">
                    {/* Date Selection */}
                    <Box display="flex" gap={2}>
                        <FormControl fullWidth>
                            <InputLabel>წელი</InputLabel>
                            <Select
                                value={year}
                                label="წელი"
                                onChange={(e) => setYear(e.target.value as number)}
                            >
                                {years.map((y) => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>თვე</InputLabel>
                            <Select
                                value={month}
                                label="თვე"
                                onChange={(e) => setMonth(e.target.value as number)}
                            >
                                {MONTHS.map((m, i) => (
                                    <MenuItem key={i} value={i}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>დღე</InputLabel>
                            <Select
                                value={day}
                                label="დღე"
                                onChange={(e) => setDay(e.target.value as number)}
                            >
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                    <MenuItem key={d} value={d}>{d}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Divider />

                    {/* Georgian Image Upload */}
                    <Typography variant="h6">ქართული სურათი (KA)</Typography>
                    <Box sx={{ my: 2 }}>
                        <ImageDropzone
                            onImageChange={(file) => setKaImage(file)}
                            initialImage={import.meta.env.VITE_API_BASE_URL + editDraft.localizations["ka"].imagePath}
                            label="ატვირთეთ ქართული სურათი"
                        />
                    </Box>

                    <Divider />

                    {/* English Image Upload */}
                    <Typography variant="h6">ინგლისური სურათი (EN)</Typography>
                    <Box sx={{ my: 2 }}>
                        <ImageDropzone
                            onImageChange={(file) => setEnImage(file)}
                            initialImage={import.meta.env.VITE_API_BASE_URL + editDraft.localizations["en"].imagePath}
                            label="Upload English image"
                        />
                    </Box>

                    <Box display="flex" gap={2} className="modal-actions">
                        <Button 
                            startIcon={(loading || updateLoading) ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                            variant="contained" 
                            onClick={async () => {
                                if (!year || month === "" || !day) {
                                    // Show error if date is not selected
                                    return;
                                }

                                try {
                                    // Create date with UTC time set to noon to avoid timezone issues
                                    const date = new Date(Date.UTC(
                                        year as number,
                                        month as number,
                                        day as number,
                                        12, 0, 0
                                    ));

                                    // Update the image with the new date and images
                                    await updateImage(
                                        editDraft.id,
                                        date,
                                        kaImage,
                                        enImage
                                    );

                                    // Call the onSave callback to refresh the data
                                    onSave();

                                    // Reset the image states
                                    setKaImage(null);
                                    setEnImage(null);
                                } catch (error) {
                                    console.error("Error updating image:", error);
                                }
                            }}
                            disabled={loading || updateLoading}
                        >
                            {(loading || updateLoading) ? 'იტვირთება...' : 'შენახვა'}
                        </Button>
                        <Button
                            startIcon={<CloseIcon />}
                            variant="outlined"
                            onClick={() => {
                                onClose();
                                setKaImage(null);
                                setEnImage(null);
                            }}
                        >
                            გაუქმება
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default EditModal;
