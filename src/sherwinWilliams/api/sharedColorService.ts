import { type SharedColorServiceColor } from "./types";
import axios from 'axios';

const API_BASE_URL = 'https://api.sherwin-williams.com/shared-color-service';

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

export const downloadColorInfo = async (colorCode: string): Promise<SharedColorServiceColor | null> => {
    const response = await axios.get(`${API_BASE_URL}/color/byColorNumber/${colorCode}`, { validateStatus: () => true});
    if (response.status !== 200) {
        return null;
        
    } else {
        return response.data as SharedColorServiceColor;
    }

};

export const toSwCodeString = (code: number): string => `SW${code.toString().padStart(4, '0')}`;

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
