import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import { ENDPOINTS } from "../../../../../api/config";
import { getYearsApi } from "../../../../../features/calendar/api/calendar.api";
import {
    deleteArticleByDate,
    getArticleByDate,
    updateArticleByDate,
} from "../../../../../features/event/api/event.api";
import EditModal from "../../components/EditModal";
import CreateModal from "../../components/CreateModal";

const MONTHS = [
    "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL + "/api"}${ENDPOINTS.EVENT.UPLOAD_IMAGE}`,
        formData,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }
    );

    return res.data.url;
};

const SearchArticle = () => {
    const [years, setYears] = useState<number[]>([]);
    const [year, setYear] = useState<number | "">("");
    const [month, setMonth] = useState<number | "">("");

    const [articleMap, setArticleMap] = useState<Record<string, any> | null>(null);
    const [editDraft, setEditDraft] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [createDate, setCreateDate] = useState<string | null>(null);

    useEffect(() => {
        getYearsApi().then((res) => setYears(res));
    }, []);

    /* helpers */
    const getLoc = (lang: "ka" | "en") =>
        editDraft?.localizations?.[lang] ?? null;

    /* SEARCH */
    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        setEditOpen(false);
        setArticleMap(null);

        try {
            const isoDate = `${year}-${String((month as number) + 1).padStart(2, "0")}-01`;
            const data = await getArticleByDate(isoDate);
            setArticleMap(data);
        } catch {
            setArticleMap(null);
        } finally {
            setLoading(false);
        }
    };

    /* DELETE */
    const handleDelete = async (date: string) => {
        const res = await Swal.fire({
            title: "წაშლა?",
            text: "დარწმუნებული ხარ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "კი, წაშალე",
            cancelButtonText: "გაუქმება",
        });

        if (!res.isConfirmed) return;

        try {
            setDeleteLoading(date);
            await deleteArticleByDate(date);
            setArticleMap((prev) => {
                if (!prev) return prev;
                return { ...prev, [date]: null };
            });

            setEditOpen(false);
            Swal.fire("წაიშალა!", "პოსტი წარმატებით წაიშალა", "success");
        } catch {
            Swal.fire("შეცდომა", "წაშლა ვერ მოხერხდა", "error");
        } finally {
            setDeleteLoading(null);
        }
    };

    /* SAVE */
    const handleSave = async () => {
        if (!editDraft || !selectedDate) return;

        try {
            setSaveLoading(true);
            let imagePath = editDraft.imagePath;

            if (editDraft.imageFile) {
                imagePath = await uploadImage(editDraft.imageFile);
            }

            const updated = await updateArticleByDate(selectedDate, {
                imagePath,
                localizations: Object.entries(editDraft.localizations).map(
                    ([languageCode, value]: [string, any]) => ({
                        languageCode,
                        title: value.title,
                        description: value.description,
                    })
                ),
            });

            setArticleMap((prev) => ({
                ...prev!,
                [selectedDate]: updated,
            }));

            setEditOpen(false);
            setEditDraft(null);
            setSelectedDate(null);

            Swal.fire("შენახულია!", "პოსტი წარმატებით განახლდა", "success");
        } catch {
            Swal.fire("შეცდომა", "განახლება ვერ მოხერხდა", "error");
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h5">პოსტის მოძებნა</Typography>

            {/* FILTERS */}
            <Box display="flex" gap={2} maxWidth={700}>
                <FormControl fullWidth>
                    <InputLabel>წელი</InputLabel>
                    <Select
                        value={year}
                        label="წელი"
                        onChange={(e) => {
                            setYear(e.target.value as number);
                            setMonth("");
                        }}
                    >
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth disabled={year === ""}>
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

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!(year !== "" && month !== "") || loading}
                >
                    ძებნა
                </Button>
            </Box>

            {/* TABLE */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>სათაური (KA)</TableCell>
                            <TableCell>თარიღი</TableCell>
                            <TableCell align="right">ქმედებები</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        )}

                        {searched && !loading && !articleMap && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    ვერ მოიძებნა
                                </TableCell>
                            </TableRow>
                        )}

                        {articleMap &&
                            Object.entries(articleMap).map(([date, value]) => (
                                <TableRow key={date}>
                                    <TableCell>{value?.id ?? "—"}</TableCell>
                                    <TableCell>
                                        {value?.localizations?.ka?.title ?? <em>No article</em>}
                                    </TableCell>
                                    <TableCell>{date}</TableCell>
                                    <TableCell align="right">
                                        {value ? (
                                            <>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setEditDraft(JSON.parse(JSON.stringify(value)));
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(date)}
                                                    disabled={deleteLoading === date}
                                                >
                                                    {deleteLoading === date ? (
                                                        <CircularProgress size={24} color="error" />
                                                    ) : (
                                                        <DeleteIcon />
                                                    )}
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton
                                                color="success"
                                                onClick={() => {
                                                    setCreateDate(date);
                                                    setCreateOpen(true);
                                                }}
                                            >
                                                +
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* EDIT MODAL */}
            <EditModal
                open={editOpen}
                onClose={() => {
                    setEditOpen(false);
                    setEditDraft(null);
                    setSelectedDate(null);
                }}
                onSave={handleSave}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                loading={saveLoading}
            />

            {/* CREATE MODAL */}
            <CreateModal
                open={createOpen}
                onClose={() => {
                    setCreateOpen(false);
                    setCreateDate(null);
                }}
                onSuccess={() => {
                    setCreateOpen(false);
                    setCreateDate(null);
                    // Refresh the data
                    handleSearch();
                    Swal.fire("შექმნილია!", "პოსტი წარმატებით შეიქმნა", "success");
                }}
                selectedDate={createDate || undefined}
            />
        </Box>
    );
};

export default SearchArticle;
