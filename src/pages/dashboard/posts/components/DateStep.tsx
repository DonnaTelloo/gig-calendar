import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function DateStep({
                      year,
                      setYear,
                      month,
                      setMonth,
                      day,
                      setDay,
                      onNext,
                      onCancel
                  }: any) {
    const YEARS = [2023, 2024, 2025, 2026, 2027];
    const MONTHS = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const daysInMonth =
        month !== "" ? new Date(year || 2025, month + 1, 0).getDate() : 31;

    const canProceed = year !== "" && month !== "" && day !== "";

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            {/* YEAR */}
            <FormControl fullWidth>
                <InputLabel>წელი</InputLabel>
                <Select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    {YEARS.map((y) => (
                        <MenuItem key={y} value={y}>
                            {y}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* MONTH */}
            <FormControl fullWidth>
                <InputLabel>თვე</InputLabel>
                <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    {MONTHS.map((m, i) => (
                        <MenuItem key={m} value={i}>
                            {m}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* DAY */}
            <FormControl fullWidth>
                <InputLabel>დღე</InputLabel>
                <Select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                >
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                        <MenuItem key={d} value={d}>
                            {d}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={onCancel}>
                    გაუქმება
                </Button>
                <Button
                    variant="contained"
                    disabled={!canProceed}
                    onClick={onNext}
                >
                    შემდეგი
                </Button>
            </Box>
        </Box>
    );
}

export default DateStep;
