export const getMonths = (t: any): string[] => {
    return t("months", { returnObjects: true }) as string[];
};