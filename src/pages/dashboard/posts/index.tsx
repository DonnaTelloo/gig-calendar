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
    const [titleKa, setTitleKa] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [reviewDataKa, setReviewDataKa] = useState("");
    const [reviewDataEn, setReviewDataEn] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [yearInfoId, setYearInfoId] = useState<number | null>(null);
    const [dataFound, setDataFound] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);
    const editorRefKa = useRef<HTMLDivElement>(null);
    const editorRefEn = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getYearsApi().then((res) => setYears(res));
    }, []);

    const handleOpenReviewModal = () => setOpenReviewModal(true);

    const handleCloseReviewModal = () => {
        // Reset all form data when modal is closed
        setOpenReviewModal(false);
        setYear(new Date().getFullYear().toString());
        setTitleKa("");
        setTitleEn("");
        setReviewDataKa("");
        setReviewDataEn("");
        setError(null);
        setYearInfoId(null);
        setDataFound(false);
        setSearched(false);

        // Clear the editor content
        if (editorRefKa.current) {
            editorRefKa.current.innerHTML = "";
        }
        if (editorRefEn.current) {
            editorRefEn.current.innerHTML = "";
        }
    };

    // Update editor content when reviewDataKa changes
    useEffect(() => {
        if (editorRefKa.current && reviewDataKa) {
            editorRefKa.current.innerHTML = reviewDataKa;
        }
    }, [reviewDataKa]);

    // Update editor content when reviewDataEn changes
    useEffect(() => {
        if (editorRefEn.current && reviewDataEn) {
            editorRefEn.current.innerHTML = reviewDataEn;
        }
    }, [reviewDataEn]);

    // Set default titles when year changes and no data is found
    useEffect(() => {
        if (!dataFound) {
            setTitleKa(`${year} წელი`);
            setTitleEn(`Year ${year}`);
        }
    }, [year, dataFound]);

    const fetchYearInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            setDataFound(false);
            setYearInfoId(null);
            setTitleKa("");
            setTitleEn("");
            setReviewDataKa("");
            setReviewDataEn("");
            setSearched(true); // Mark that a search has been performed

            try {
                const data = await getYearInfoApi(year);
                if (data && data.id) {
                    setYearInfoId(data.id);
                    setTitleKa(`${year} წელი`);
                    setTitleEn(`Year ${year}`);

                    // Extract descriptions from localizations
                    if (data.localizations && data.localizations.length > 0) {
                        // Find Georgian description
                        const kaLocalization = data.localizations.find(loc => loc.languageCode === "ka");
                        if (kaLocalization) {
                            setReviewDataKa(kaLocalization.description || "");
                        }

                        // Find English description
                        const enLocalization = data.localizations.find(loc => loc.languageCode === "en");
                        if (enLocalization) {
                            setReviewDataEn(enLocalization.description || "");
                        }
                    }

                    setDataFound(true);
                } else {
                    setDataFound(false);
                    setTitleKa("");
                    setTitleEn("");
                    setReviewDataKa("");
                    setReviewDataEn("");
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    // 404 means no data for this year - this is expected
                    setDataFound(false);
                    setReviewDataKa("");
                    setReviewDataEn("");
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

            // Get content from the HTML editors
            const descriptionKa = editorRefKa.current ? editorRefKa.current.innerHTML : reviewDataKa;
            const descriptionEn = editorRefEn.current ? editorRefEn.current.innerHTML : reviewDataEn;

            // Construct localizations array with titles in the description
            const localizations = [
                {
                    languageCode: "ka",
                    description: descriptionKa,
                    title: titleKa
                },
                {
                    languageCode: "en",
                    description: descriptionEn,
                    title: titleEn
                }
            ];

            if (dataFound && yearInfoId) {
                // Update existing year info
                await updateYearInfoApi(yearInfoId, {
                    id: yearInfoId,
                    year,
                    localizations
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
                    localizations
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
                            {/* Georgian Title */}
                            <Typography variant="subtitle1" mb={1}>
                                სათაური KA:
                            </Typography>
                            <TextField
                                label="სათაური (ქართულად)"
                                value={titleKa}
                                onChange={(e) => setTitleKa(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 2 }}
                            />

                            {/* English Title */}
                            <Typography variant="subtitle1" mb={1}>
                                სათაური EN:
                            </Typography>
                            <TextField
                                label="Title (in English)"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 2 }}
                            />

                            {/* Georgian Description */}
                            <Typography variant="subtitle1" mb={1}>
                                აღწერა KA:
                            </Typography>
                            <Box
                                ref={editorRefKa}
                                contentEditable
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: 150,
                                    mb: 2,
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    '&:focus': {
                                        outline: 'none',
                                        border: '1px solid #666',
                                    },
                                    overflowY: 'auto',
                                }}
                                dangerouslySetInnerHTML={{ __html: reviewDataKa }}
                            />

                            {/* English Description */}
                            <Typography variant="subtitle1" mb={1}>
                                აღწერა EN:
                            </Typography>
                            <Box
                                ref={editorRefEn}
                                contentEditable
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: 150,
                                    mb: 2,
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    '&:focus': {
                                        outline: 'none',
                                        border: '1px solid #666',
                                    },
                                    overflowY: 'auto',
                                }}
                                dangerouslySetInnerHTML={{ __html: reviewDataEn }}
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

                            {/* Georgian Title */}
                            <Typography variant="subtitle1" mb={1}>
                                სათაური KA:
                            </Typography>
                            <TextField
                                label="სათაური (ქართულად)"
                                value={titleKa}
                                onChange={(e) => setTitleKa(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 2 }}
                            />

                            {/* English Title */}
                            <Typography variant="subtitle1" mb={1}>
                                სათაური EN:
                            </Typography>
                            <TextField
                                label="Title (in English)"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 2 }}
                            />

                            {/* Georgian Description */}
                            <Typography variant="subtitle1" mb={1}>
                                აღწერა KA:
                            </Typography>
                            <Box
                                ref={editorRefKa}
                                contentEditable
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: 150,
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

                            {/* English Description */}
                            <Typography variant="subtitle1" mb={1}>
                                აღწერა EN:
                            </Typography>
                            <Box
                                ref={editorRefEn}
                                contentEditable
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: 150,
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
