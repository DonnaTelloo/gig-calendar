import { ENDPOINTS } from "../../../api/config";
import { getWithRetry, postWithRetry, putWithRetry, deleteWithRetry } from "../../../api/resilient-client";

export interface YearsResponse {
    years: number[];
}

export interface YearInfoResponse {
    id?: number;
    year?: number;
    title?: string;
    description?: string;
    content: string;
}

export interface YearInfoRequest {
    id: number;
    year: string;
    title?: string;
    description?: string;
    content?: string;
}

/**
 * Fetches available years from the API with retry capability
 * @returns Promise with years data
 */
export async function getYearsApi(): Promise<YearsResponse> {
    const response = await getWithRetry<YearsResponse>(ENDPOINTS.CALENDAR.YEARS);
    return response.data;
}

/**
 * Fetches year information from the API with retry capability
 * @param year The year to fetch information for
 * @returns Promise with year information data
 */
export async function getYearInfoApi(year: string): Promise<YearInfoResponse> {
    const response = await getWithRetry<YearInfoResponse>(`${ENDPOINTS.CALENDAR.YEAR_INFO}/by-year?year=${year}`);
    return response.data;
}

/**
 * Submits year information to the API with retry capability
 * @param data The year information data to submit
 * @returns Promise with the response
 */
export async function submitYearInfoApi(data: YearInfoRequest): Promise<any> {
    const response = await postWithRetry(`${ENDPOINTS.CALENDAR.YEAR_INFO}/create`, data);
    return response.data;
}

/**
 * Updates year information in the API with retry capability
 * @param id The ID of the year information to update
 * @param data The year information data to update
 * @returns Promise with the response
 */
export async function updateYearInfoApi(id: number, data: YearInfoRequest): Promise<any> {
    const response = await putWithRetry(`/yearinfo/${id}`, data);
    return response.data;
}

/**
 * Deletes year information from the API with retry capability
 * @param id The ID of the year information to delete
 * @returns Promise with the response
 */
export async function deleteYearInfoApi(id: number): Promise<any> {
    const response = await deleteWithRetry(`/yearinfo/${id}`);
    return response.data;
}
