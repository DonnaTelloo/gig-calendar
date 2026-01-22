import { useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography,
    Stepper,
    Step,
    StepLabel,
    InputLabel,
    FormControl,
    Chip
} from "@mui/material";

type Mode = "choose" | "search" | "create";

const YEARS = [2023, 2024, 2025, 2026, 2027];
const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const PostsPage = () => {
    const [mode, setMode] = useState<Mode>("choose");
    const [step, setStep] = useState(0);

    // date
    const [years, setYears] = useState<number[]>([]);
    const [month, setMonth] = useState<number | "">("");
    const [day, setDay] = useState<number | "">("");

    // bilingual form (NEW)
    const [titleKa, setTitleKa] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descriptionKa, setDescriptionKa] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");

    const [image, setImage] = useState<File | null>(null);

    const daysInMonth =
        month !== "" ? new Date(2025, month + 1, 0).getDate() : 31;

    const canProceed =
        years.length > 0 && month !== "" && day !== "";

    const selectedDateLabel =
        canProceed
            ? `${years.join(", ")} / ${MONTHS[month as number]} / ${day}`
            : "";

    // step 2 validation (NEW)
    const isStep2Valid =
        titleKa.trim() &&
        titleEn.trim() &&
        descriptionKa.trim() &&
        descriptionEn.trim();

    const resetAll = () => {
        setStep(0);
        setYears([]);
        setMonth("");
        setDay("");
        setTitleKa("");
        setTitleEn("");
        setDescriptionKa("");
        setDescriptionEn("");
        setImage(null);
    };

    return (
        <Box p={4} maxWidth={600}>
            <Typography variant="h4" mb={3}>
                პოსტები
            </Typography>

            {/* ================= MODE CHOOSER ================= */}
            {mode === "choose" && (
                <Box display="flex" flexDirection="column" gap={3}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            resetAll();
                            setMode("search");
                        }}
                    >
                        პოსტის მოძებნა თარიღით
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => {
                            resetAll();
                            setMode("create");
                        }}
                    >
                        ახალი პოსტის შექმნა
                    </Button>
                </Box>
            )}

            {/* ================= SEARCH MODE ================= */}
            {mode === "search" && (
                <Box display="flex" flexDirection="column" gap={3}>
                    <Typography variant="h5">
                        პოსტის მოძებნა
                    </Typography>

                    <FormControl fullWidth>
                        <InputLabel>წელი</InputLabel>
                        <Select
                            value={years[0] || ""}
                            label="წელი"
                            onChange={(e) =>
                                setYears([e.target.value as number])
                            }
                        >
                            {YEARS.map((y) => (
                                <MenuItem key={y} value={y}>
                                    {y}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>თვე</InputLabel>
                        <Select
                            value={month}
                            label="თვე"
                            onChange={(e) =>
                                setMonth(e.target.value as number)
                            }
                        >
                            {MONTHS.map((m, i) => (
                                <MenuItem key={m} value={i}>
                                    {m}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>დღე</InputLabel>
                        <Select
                            value={day}
                            label="დღე"
                            onChange={(e) =>
                                setDay(e.target.value as number)
                            }
                        >
                            {Array.from(
                                { length: daysInMonth },
                                (_, i) => i + 1
                            ).map((d) => (
                                <MenuItem key={d} value={d}>
                                    {d}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            onClick={() => setMode("choose")}
                        >
                            უკან
                        </Button>

                        <Button
                            variant="contained"
                            disabled={!canProceed}
                            onClick={() => {
                                console.log("SEARCH:", {
                                    year: years[0],
                                    month,
                                    day,
                                });
                            }}
                        >
                            ძებნა
                        </Button>
                    </Box>
                </Box>
            )}

            {/* ================= CREATE MODE ================= */}
            {mode === "create" && (
                <>
                    <Stepper activeStep={step} sx={{ mb: 4 }}>
                        <Step>
                            <StepLabel>თარიღი</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>კონტენტი</StepLabel>
                        </Step>
                    </Stepper>

                    {/* STEP 1 */}
                    {step === 0 && (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <FormControl fullWidth>
                                <InputLabel>წელი</InputLabel>
                                <Select
                                    multiple
                                    value={years}
                                    label="წელი"
                                    onChange={(e) =>
                                        setYears(
                                            e.target.value as number[]
                                        )
                                    }
                                    renderValue={(selected) => (
                                        <Box
                                            display="flex"
                                            gap={1}
                                            flexWrap="wrap"
                                        >
                                            {(selected as number[]).map(
                                                (y) => (
                                                    <Chip
                                                        key={y}
                                                        label={y}
                                                    />
                                                )
                                            )}
                                        </Box>
                                    )}
                                >
                                    {YEARS.map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>თვე</InputLabel>
                                <Select
                                    value={month}
                                    label="თვე"
                                    onChange={(e) =>
                                        setMonth(
                                            e.target.value as number
                                        )
                                    }
                                >
                                    {MONTHS.map((m, i) => (
                                        <MenuItem
                                            key={m}
                                            value={i}
                                        >
                                            {m}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>დღე</InputLabel>
                                <Select
                                    value={day}
                                    label="დღე"
                                    onChange={(e) =>
                                        setDay(
                                            e.target.value as number
                                        )
                                    }
                                >
                                    {Array.from(
                                        { length: daysInMonth },
                                        (_, i) => i + 1
                                    ).map((d) => (
                                        <MenuItem
                                            key={d}
                                            value={d}
                                        >
                                            {d}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box display="flex" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setMode("choose")
                                    }
                                >
                                    გაუქმება
                                </Button>

                                <Button
                                    variant="contained"
                                    disabled={!canProceed}
                                    onClick={() => setStep(1)}
                                >
                                    შემდეგი
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* STEP 2 */}
                    {step === 1 && (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                label="არჩეული თარიღი"
                                value={selectedDateLabel}
                                disabled
                                fullWidth
                            />

                            <Typography variant="h6">ქართული</Typography>

                            <TextField
                                label="სათაური (KA)"
                                required
                                value={titleKa}
                                onChange={(e) =>
                                    setTitleKa(
                                        e.target.value.slice(0, 60)
                                    )
                                }
                                helperText={`${titleKa.length}/60`}
                                fullWidth
                            />

                            <TextField
                                label="აღწერა (KA)"
                                required
                                multiline
                                rows={4}
                                value={descriptionKa}
                                onChange={(e) =>
                                    setDescriptionKa(
                                        e.target.value.slice(0, 250)
                                    )
                                }
                                helperText={`${descriptionKa.length}/250`}
                                fullWidth
                            />

                            <Typography variant="h6">English</Typography>

                            <TextField
                                label="Title (EN)"
                                required
                                value={titleEn}
                                onChange={(e) =>
                                    setTitleEn(
                                        e.target.value.slice(0, 60)
                                    )
                                }
                                helperText={`${titleEn.length}/60`}
                                fullWidth
                            />

                            <TextField
                                label="Description (EN)"
                                required
                                multiline
                                rows={4}
                                value={descriptionEn}
                                onChange={(e) =>
                                    setDescriptionEn(
                                        e.target.value.slice(0, 250)
                                    )
                                }
                                helperText={`${descriptionEn.length}/250`}
                                fullWidth
                            />

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                ატვირთე სურათი
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                            </Button>

                            {image && (
                                <Typography variant="caption">
                                    სურათი: {image.name}
                                </Typography>
                            )}

                            <Box display="flex" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setStep(0)}
                                >
                                    უკან
                                </Button>

                                <Button
                                    variant="contained"
                                    disabled={!isStep2Valid}
                                    onClick={() => {
                                        console.log("CREATE POST:", {
                                            years,
                                            month,
                                            day,
                                            title: {
                                                ka: titleKa,
                                                en: titleEn,
                                            },
                                            description: {
                                                ka: descriptionKa,
                                                en: descriptionEn,
                                            },
                                            image,
                                        });
                                    }}
                                >
                                    დამატება
                                </Button>
                            </Box>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default PostsPage;
