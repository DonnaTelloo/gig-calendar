import { ENDPOINTS } from "../../../api/config";
import { getWithRetry } from "../../../api/resilient-client";

export interface YearsResponse {
    years: number[];
}

/**
 * Fetches available years from the API with retry capability
 * @returns Promise with years data
 */
export async function getYearsApi(): Promise<YearsResponse> {
    const response = await getWithRetry<YearsResponse>(ENDPOINTS.CALENDAR.YEARS);
    return response.data;
}
