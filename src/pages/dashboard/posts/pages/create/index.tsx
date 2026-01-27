// CreatePostPage.tsx
import { useState } from "react";
import {
    Stepper,
    Step,
    StepLabel, Container,
} from "@mui/material";
import Swal from "sweetalert2";

import DateStep from "../../components/DateStep.tsx";
import useCreatePost from "../../hooks/usePost.ts";
import ContentStep from "../../components/ContentStep.tsx";

export default function CreatePostPage() {
    const [step, setStep] = useState(0);

    const [year, setYear] = useState<number[]>([]);
    const [month, setMonth] = useState<number | "">("");
    const [day, setDay] = useState<number | "">("");

    const [titleKa, setTitleKa] = useState("");
    const [descriptionKa, setDescriptionKa] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const { createPost, loading } = useCreatePost();

    const resetForm = () => {
        setStep(0);

        setYear([]);
        setMonth("");
        setDay("");

        setTitleKa("");
        setDescriptionKa("");
        setTitleEn("");
        setDescriptionEn("");
        setImage(null);
    };

    const handleCreatePost = async () => {
        try {
            await createPost({
                year,
                month,
                day,
                titleKa,
                descriptionKa,
                titleEn,
                descriptionEn,
                image,
            });

            const result = await Swal.fire({
                icon: "success",
                title: "წარმატება",
                text: "პოსტი წარმატებით შეიქმნა",
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
                    "პოსტის შექმნისას მოხდა შეცდომა",
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
                <Step><StepLabel>კონტენტი</StepLabel></Step>
            </Stepper>

            {step === 0 && (
                <DateStep
                    years={year}
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
                    titleKa={titleKa}
                    setTitleKa={setTitleKa}
                    descriptionKa={descriptionKa}
                    setDescriptionKa={setDescriptionKa}
                    titleEn={titleEn}
                    setTitleEn={setTitleEn}
                    descriptionEn={descriptionEn}
                    setDescriptionEn={setDescriptionEn}
                    image={image}
                    setImage={setImage}
                    loading={loading}
                    onBack={() => setStep(0)}
                    onSubmit={() => handleCreatePost()}
                />
            )}
        </Container>
    );
}
