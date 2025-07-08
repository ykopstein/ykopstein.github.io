import { type SharedColorServiceColor } from "./types";

export const getColorInfo = async (colorCode: string): Promise<SharedColorServiceColor | null> => {
    const cached = tryGetColorInfoFromCache(colorCode);
    if(cached !== false) return cached;

    const colorInfo = await downloadColorInfo(colorCode);
    if (colorInfo !== null) {
        addToCache(colorCode, colorInfo);
        return colorInfo;
    }

    return null;
};

const downloadColorInfo = async (colorCode: string): Promise<SharedColorServiceColor | null> => {
    const response = await fetch(`https://api.sherwin-williams.com/shared-color-service/color/byColorNumber/${colorCode}`);
    if (!response.ok) {
        console.error(`Failed to fetch color info for ${colorCode}: ${response.statusText}`);
        return null;
    }

    const json = await response.json();

    return json as SharedColorServiceColor;
};

const tryGetColorInfoFromCache = (colorCode: string): SharedColorServiceColor | false => {
    const key = getCacheKey(colorCode);
    
    const cached = localStorage.getItem(key);
    if (cached) {
        return JSON.parse(cached) as SharedColorServiceColor;
    
    } else {
        return false;
    }
}

const addToCache = (colorCode: string, colorInfo: SharedColorServiceColor): void => {
    const key = getCacheKey(colorCode);
    localStorage.setItem(key, JSON.stringify(colorInfo));
}

const getCacheKey = (colorCode: string): string => `scs:color:${colorCode.toUpperCase()}`;
