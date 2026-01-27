import {postArticle} from "../../../../features/event/api/event.api.ts";
import {useState} from "react";


function useCreatePost() {
    const [loading, setLoading] = useState(false);

    const createPost = async (params: {
        year: number;
        month: number;
        day: number;
        titleKa: string;
        descriptionKa: string;
        titleEn: string;
        descriptionEn: string;
        image?: File | null;
    }) => {
        setLoading(true);

        // Create date with UTC time set to noon to avoid timezone issues
        const date = new Date(Date.UTC(
            params.year,
            params.month,
            params.day,
            12, 0, 0
        ));

        const imagePath = params.image;

        const data = await postArticle(date, imagePath, [
            {
                languageCode: "ka",
                title: params.titleKa,
                description: params.descriptionKa
            },
            {
                languageCode: "en",
                title: params.titleEn,
                description: params.descriptionEn
            }
        ]);

        setLoading(false);

        return data;
    };

    return { createPost, loading };
}

export default useCreatePost;
