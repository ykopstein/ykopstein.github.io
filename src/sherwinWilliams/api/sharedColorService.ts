import { type SharedColorServiceColor } from "./types";

export const getColorInfo = async (colorCode: string): Promise<SharedColorServiceColor | null> => {
    const cached = tryGetColorInfoFromCache(colorCode);
    if (cached === 'invalid-code') return null;
    else if (cached !== 'cache-miss') return cached;

    const colorInfo = await downloadColorInfo(colorCode);
    if (colorInfo !== null) {
        addToCache(colorCode, colorInfo);
        return colorInfo;
    } else {
        addInvalidCodeToCache(colorCode);
        return null;
    }
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

const tryGetColorInfoFromCache = (colorCode: string): SharedColorServiceColor | 'invalid-code' | 'cache-miss' => {
    const key = getCacheKey(colorCode);

    const cached = localStorage.getItem(key);
    if (cached === 'invalid-code') {
        return 'invalid-code';

    } else if (cached) {
        return JSON.parse(cached) as SharedColorServiceColor;

    } else {
        return 'cache-miss';
    }
}

const addToCache = (colorCode: string, colorInfo: SharedColorServiceColor): void => {
    const key = getCacheKey(colorCode);
    localStorage.setItem(key, JSON.stringify(colorInfo));
}

const addInvalidCodeToCache = (colorCode: string): void => {
    const key = getCacheKey(colorCode);
    localStorage.setItem(key, 'invalid-code');
}

const getCacheKey = (colorCode: string): string => `scs:color:${colorCode.toUpperCase()}`;
