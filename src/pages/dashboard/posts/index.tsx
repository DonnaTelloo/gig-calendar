import {
    Box,
    Typography,
    Button,
    Stack,
    Modal,
    TextField,
    Paper,
    TextareaAutosize,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { getYearInfoApi, submitYearInfoApi, updateYearInfoApi, deleteYearInfoApi, getYearsApi } from "../../../features/calendar/api/calendar.api";

export default function PostsPage() {
    const navigate = useNavigate();
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [years, setYears] = useState<number[]>([]);
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [title, setTitle] = useState("");
    const [reviewData, setReviewData] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [yearInfoId, setYearInfoId] = useState<number | null>(null);
    const [dataFound, setDataFound] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getYearsApi().then((res) => setYears(res));
    }, []);

    const handleOpenReviewModal = () => setOpenReviewModal(true);

    const handleCloseReviewModal = () => {
        // Reset all form data when modal is closed
        setOpenReviewModal(false);
        setYear(new Date().getFullYear().toString());
        setTitle("");
        setReviewData("");
        setError(null);
        setYearInfoId(null);
        setDataFound(false);
        setSearched(false);

        // Clear the editor content
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
    };

    // Update editor content when reviewData changes
    useEffect(() => {
        if (editorRef.current && reviewData) {
            editorRef.current.innerHTML = reviewData;
        }
    }, [reviewData]);

    // Set default title when year changes and no data is found
    useEffect(() => {
        if (!dataFound) {
            setTitle(`${year} წელი`);
        }
    }, [year, dataFound]);

    const fetchYearInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            setDataFound(false);
            setYearInfoId(null);
            setTitle("");
            setReviewData("");
            setSearched(true); // Mark that a search has been performed

            try {
                const data = await getYearInfoApi(year);
                if (data && data.id) {
                    setYearInfoId(data.id);
                    setTitle(data.title || `${year} წელი`);
                    setReviewData(data.description || data.content || "");
                    setDataFound(true);
                } else {
                    setDataFound(false);
                    setTitle("");
                    setReviewData("");
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    // 404 means no data for this year - this is expected
                    setDataFound(false);
                    setReviewData("");
                } else {
                    // Other errors should be reported
                    throw error;
                }
            }
        } catch (error) {
            console.error("Failed to fetch year info:", error);
            setError("Failed to fetch year information");
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch year information',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get content from the HTML editor
            const description = editorRef.current ? editorRef.current.innerHTML : reviewData;

            if (dataFound && yearInfoId) {
                // Update existing year info
                await updateYearInfoApi(yearInfoId, {
                    id: yearInfoId,
                    year,
                    title,
                    description
                });

                Swal.fire({
                    title: 'Success',
                    text: 'Year information updated successfully',
                    icon: 'success',
                });
            } else {
                // Create new year info
                const result = await submitYearInfoApi({
                    year,
                    title,
                    description
                });

                if (result && result.id) {
                    setYearInfoId(result.id);
                    setDataFound(true);
                }

                Swal.fire({
                    title: 'Success',
                    text: 'Year information created successfully',
                    icon: 'success',
                });
            }

            handleCloseReviewModal();
        } catch (error) {
            console.error("Failed to save year info:", error);
            setError("Failed to save year information");
            Swal.fire({
                title: 'Error',
                text: 'Failed to save year information',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteYearInfo = async () => {
        if (!yearInfoId) return;

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this year information!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            });

            if (result.isConfirmed) {
                setLoading(true);
                await deleteYearInfoApi(yearInfoId);

                setYearInfoId(null);
                setDataFound(false);
                setReviewData("");

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Year information has been deleted.',
                    icon: 'success',
                });
            }
        } catch (error) {
            console.error("Failed to delete year info:", error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete year information',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4} maxWidth={600}>
            <Typography variant="h4" mb={3}>
                პოსტები
            </Typography>

            <Stack direction="column" spacing={2}>
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

                <Typography variant="h4" mt={3} mb={1}>
                    მიმოხილვა
                </Typography>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleOpenReviewModal}
                >
                    წლის მიმოხილვა
                </Button>
            </Stack>

            {/* Year Review Modal */}
            <Modal
                open={openReviewModal}
                disableEscapeKeyDown
                aria-labelledby="year-review-modal"
                aria-describedby="modal-for-year-review"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="h2">
                            წლის მიმოხილვა
                        </Typography>
                        <Button 
                            onClick={handleCloseReviewModal}
                            sx={{ minWidth: 'auto', p: 1 }}
                        >
                            ✕
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControl fullWidth sx={{ mr: 2 }}>
                            <InputLabel id="year-select-label">წელი</InputLabel>
                            <Select
                                labelId="year-select-label"
                                value={year}
                                label="წელი"
                                onChange={(e) => setYear(e.target.value as string)}
                            >
                                {years.map((y) => (
                                    <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button 
                            variant="outlined" 
                            onClick={fetchYearInfo} 
                            disabled={loading}
                            sx={{ height: 40, minWidth: 120 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                'მოძებნა'
                            )}
                        </Button>
                    </Box>

                    {searched && dataFound ? (
                        <>
                            <TextField
                                label="სათაური"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="subtitle1" mb={1}>
                                აღწერა:
                            </Typography>

                            <Box
                                ref={editorRef}
                                contentEditable
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: 200,
                                    mb: 2,
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    '&:focus': {
                                        outline: 'none',
                                        border: '1px solid #666',
                                    },
                                    overflowY: 'auto',
                                }}
                                dangerouslySetInnerHTML={{ __html: reviewData }}
                            />

                            <Stack direction="row" spacing={2} justifyContent="space-between">
                                <Button 
                                    variant="outlined" 
                                    color="error"
                                    onClick={handleDeleteYearInfo}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="error" /> : null}
                                >
                                    წაშლა
                                </Button>

                                <Stack direction="row" spacing={2}>
                                    <Button 
                                        onClick={handleCloseReviewModal}
                                        disabled={loading}
                                    >
                                        გაუქმება
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleSubmitReview}
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        განახლება
                                    </Button>
                                </Stack>
                            </Stack>
                        </>
                    ) : searched ? (
                        <>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                ინფორმაცია ამ წლისთვის არ მოიძებნა.
                            </Alert>

                            <TextField
                                label="სათაური"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="subtitle1" mb={1}>
                                აღწერა:
                            </Typography>

                            <Box
                                ref={editorRef}
                                contentEditable
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: 200,
                                    mb: 2,
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    '&:focus': {
                                        outline: 'none',
                                        border: '1px solid #666',
                                    },
                                    overflowY: 'auto',
                                }}
                            />

                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button 
                                    onClick={handleCloseReviewModal}
                                    disabled={loading}
                                >
                                    გაუქმება
                                </Button>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSubmitReview}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    დამატება
                                </Button>
                            </Stack>
                        </>
                    ) : null}
                </Paper>
            </Modal>
        </Box>
    );
}
