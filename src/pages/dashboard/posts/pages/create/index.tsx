// CreatePostPage.tsx
import { useState, useEffect } from "react";
import {
    Stepper,
    Step,
    StepLabel, Container,
} from "@mui/material";
import Swal from "sweetalert2";

import DateStep from "../../components/DateStep.tsx";
import useImage from "../../hooks/useImage";
import ContentStep from "../../components/ContentStep.tsx";
import { getYearsApi } from "../../../../../features/calendar/api/calendar.api";

export default function CreatePostPage() {
    const [step, setStep] = useState(0);

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

    const resetForm = () => {
        setStep(0);
        setYear("");
        setMonth("");
        setDay("");
        setKaImage(null);
        setEnImage(null);
    };

    const handleCreatePost = async () => {
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

            const result = await Swal.fire({
                icon: "success",
                title: "წარმატება",
                text: "სურათი წარმატებით შეიქმნა",
                confirmButtonText: "კარგი",
            });

            if (result.isConfirmed) {
                resetForm();
            }

        } catch (err: any) {
            const result = await Swal.fire({
                icon: "error",
                title: "შეცდომა",
                text:
                    err?.response?.data?.message ||
                    "სურათის შექმნისას მოხდა შეცდომა",
                confirmButtonText: "დახურვა",
            });

            if (result.isConfirmed) {
                resetForm();
            }
        }
    };

    return (
        <Container>
            <Stepper activeStep={step} sx={{ mb: 4 }}>
                <Step><StepLabel>თარიღი</StepLabel></Step>
                <Step><StepLabel>სურათები</StepLabel></Step>
            </Stepper>

            {step === 0 && (
                <DateStep
                    years={years}
                    setYear={setYear}
                    month={month}
                    setMonth={setMonth}
                    day={day}
                    setDay={setDay}
                    onNext={() => setStep(1)}
                />
            )}

            {step === 1 && (
                <ContentStep
                    kaImage={kaImage}
                    setKaImage={setKaImage}
                    enImage={enImage}
                    setEnImage={setEnImage}
                    loading={loading}
                    onBack={() => setStep(0)}
                    onSubmit={() => handleCreatePost()}
                />
            )}
        </Container>
    );
}
