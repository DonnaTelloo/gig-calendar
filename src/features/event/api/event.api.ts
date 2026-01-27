import { ENDPOINTS } from "../../../api/config";
import { getWithRetry, postWithRetry, putWithRetry, deleteWithRetry } from "../../../api/resilient-client";

type LocalizationInput = {
    languageCode: "ka" | "en";
    title: string;
    description: string;
};

/**
 * Get article by date
 * @param date The date to get the article for
 * @returns Promise with the article data
 */
export async function getArticleByDate(date: string) {
    const response = await getWithRetry(ENDPOINTS.EVENT.ARTICLE_BY_DATE, {
        params: { date }
    });

    return response.data;
}

/**
 * Delete article by date
 * @param date The date of the article to delete
 * @returns Promise with the delete response
 */
export async function deleteArticleByDate(date: string) {
    const response = await deleteWithRetry(ENDPOINTS.EVENT.BASE, {
        params: { date }
    });

    return response.data;
}

/**
 * Update article by date
 * @param date The date of the article to update
 * @param payload The update payload
 * @returns Promise with the updated article data
 */
export async function updateArticleByDate(
    date: string,
    payload: {
        imagePath: string;
        localizations: {
            languageCode: string;
            title: string;
            description: string;
        }[];
    }
) {
    const response = await putWithRetry(
        ENDPOINTS.EVENT.UPDATE_BY_DATE,
        payload,
        {
            params: { date },
        }
    );

    return response.data;
}

/**
 * Get articles by date and language
 * @param date The date to filter articles
 * @param lang The language code
 * @returns Promise with the articles response
 */
export async function getArticles(date: any, lang: string = "ka") {
    const response = await getWithRetry(ENDPOINTS.EVENT.ARTICLES, {
        params: { date, languageCode: lang }
    });

    return response;
}

/**
 * Upload an image for an article
 * @param image The image file to upload
 * @returns Promise with the upload response
 */
const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    const response = await postWithRetry(
        ENDPOINTS.EVENT.UPLOAD_IMAGE,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response;
};

/**
 * Create a new article
 * @param date The date for the article
 * @param image The image file for the article
 * @param localizations The article localizations
 * @returns Promise with the created article data
 */
export async function postArticle(
    date: Date,
    image: File,
    localizations: LocalizationInput[]
) {
    const imageData = await uploadImage(image);

    // Format date as YYYY-MM-DD to ensure correct date is sent
    const formattedDate = date.toISOString().split('T')[0];
    console.log('Sending date to API:', formattedDate);

    const response = await postWithRetry(
        ENDPOINTS.EVENT.BASE,
        {
            article: {
                date: formattedDate,
                ImagePath: imageData.data.url
            },
            localizations
        }
    );

    return response.data;
}
