import { Box, Button, Divider, TextField, Typography, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import useCreatePost from "../../hooks/usePost";
import { getYearsApi } from "../../../../../features/calendar/api/calendar.api";
import "../EditModal/style.css";

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
    
    const [titleKa, setTitleKa] = useState("");
    const [descriptionKa, setDescriptionKa] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const { createPost, loading } = useCreatePost();

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
        setTitleKa("");
        setDescriptionKa("");
        setTitleEn("");
        setDescriptionEn("");
        setImageFile(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        if (!year || month === "" || !day || !titleKa || !descriptionKa || !titleEn || !descriptionEn || !imageFile) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await createPost({
                year: year as number,
                month: month as number,
                day: day as number,
                titleKa,
                descriptionKa,
                titleEn,
                descriptionEn,
                image: imageFile,
            });

            resetForm();
            onSuccess();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        }
    };

    if (!open) return null;

    return (
        <div className="edit-overlay" onClick={handleClose}>
            <div
                className="edit-modal"
                onClick={(e) => e.stopPropagation()}
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

                    {/* Image Upload */}
                    {imageFile && (
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="preview"
                            style={{ maxWidth: 300, borderRadius: 8 }}
                        />
                    )}

                    <Button component="label" variant="outlined">
                        სურათის ატვირთვა
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                        />
                    </Button>

                    <Divider />

                    {/* Georgian Content */}
                    <TextField
                        label="სათაური (KA)"
                        value={titleKa}
                        onChange={(e) => setTitleKa(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="აღწერა (KA)"
                        value={descriptionKa}
                        onChange={(e) => setDescriptionKa(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />

                    <Divider />

                    {/* English Content */}
                    <TextField
                        label="Title (EN)"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Description (EN)"
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />

                    <Box display="flex" gap={2} className="modal-actions">
                        <Button 
                            startIcon={<SaveIcon />} 
                            variant="contained" 
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "შენახვა..." : "შენახვა"}
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