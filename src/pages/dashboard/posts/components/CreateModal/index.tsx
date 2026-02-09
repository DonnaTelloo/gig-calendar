import { Box, Button, Divider, Typography, FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import useImage from "../../hooks/useImage";
import { getYearsApi } from "../../../../../features/calendar/api/calendar.api";
import "../EditModal/style.css";
import Swal from "sweetalert2";
import ImageDropzone from "../../../../../components/common/ImageDropzone";

type CreateModalProps = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedDate?: string;
};

const MONTHS = [
    "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

const CreateModal = ({ open, onClose, onSuccess, selectedDate }: CreateModalProps) => {
    const [years, setYears] = useState<number[]>([]);
    const [year, setYear] = useState<number | "">("");
    const [month, setMonth] = useState<number | "">("");
    const [day, setDay] = useState<number | "">("");

    const [kaImage, setKaImage] = useState<File | null>(null);
    const [enImage, setEnImage] = useState<File | null>(null);

    const { createImage, loading } = useImage();

    // Load available years
    useEffect(() => {
        getYearsApi().then((res) => setYears(res));
    }, []);

    // Parse selected date if provided
    useEffect(() => {
        if (selectedDate) {
            const [yearStr, monthStr, dayStr] = selectedDate.split('-');
            setYear(parseInt(yearStr));
            setMonth(parseInt(monthStr) - 1); // API months are 1-indexed, but we use 0-indexed
            setDay(parseInt(dayStr));
        }
    }, [selectedDate]);

    // Reset form when modal is closed
    const resetForm = () => {
        setYear("");
        setMonth("");
        setDay("");
        setKaImage(null);
        setEnImage(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        if (!year || month === "" || !day || !kaImage || !enImage) {
            Swal.fire({
                title: 'შეცდომა',
                text: 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი',
                icon: 'error',
            });
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

            await createImage(date, kaImage, enImage);

            resetForm();
            onSuccess();
        } catch (error) {
            console.error("Error creating image post:", error);
            Swal.fire({
                title: 'შეცდომა',
                text: 'სურათის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.',
                icon: 'error',
            });
        }
    };

    if (!open) return null;

    return (
        <div className="edit-overlay">
            <div
                className="edit-modal"
            >
                <Typography variant="h6" className="modal-title">ახალი პოსტის შექმნა</Typography>
                <Button className="close-btn" onClick={handleClose}>
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

                    <Box display="flex" gap={2} className="modal-actions">
                        <Button 
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            variant="contained" 
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "იტვირთება..." : "შენახვა"}
                        </Button>
                        <Button
                            startIcon={<CloseIcon />}
                            variant="outlined"
                            onClick={handleClose}
                        >
                            გაუქმება
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default CreateModal;
