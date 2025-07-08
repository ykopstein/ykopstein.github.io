import { type SharedColorServiceColor } from "./types";

export const getColorInfo = async (colorCode: string): Promise<SharedColorServiceColor | null> => {
    const response = await fetch(`https://api.sherwin-williams.com/shared-color-service/color/byColorNumber/${colorCode}`);
    if (!response.ok) {
        console.error(`Failed to fetch color info for ${colorCode}: ${response.statusText}`);
        return null;
    }

    const json = await response.json();

    return json as SharedColorServiceColor;
};
