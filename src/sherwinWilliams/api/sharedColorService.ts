import { type IColorMetadata, type SharedColorServiceColor } from "./types";
import axios from 'axios';

const API_BASE_URL = 'https://api.sherwin-williams.com/shared-color-service';

export const getColor = async (colorCode: string): Promise<SharedColorServiceColor | null> => {
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
    const response = await axios.get(`${API_BASE_URL}/color/byColorNumber/${colorCode}`, { validateStatus: () => true });
    if (response.status !== 200) {
        return null;

    } else {
        return response.data as SharedColorServiceColor;
    }

};

export const toSwCodeString = (code: number): string => `SW${code.toString().padStart(4, '0')}`;

export const calculateMetadata = (scsColor: SharedColorServiceColor): IColorMetadata => {
    const pcntHue = parseFloat(scsColor.hue);
    const hue = pcntHue * 360;

    const r = parseInt(scsColor.red, 10);
    const g = parseInt(scsColor.green, 10);
    const b = parseInt(scsColor.blue, 10);

    const hsv = rgbToHsv(r, g, b);
    
    return {
        number: scsColor.colorNumber,
        name: scsColor.name,
        hex: scsColor.hex,
        rgb: { r: r, g: g, b: b },
        hsl: { h: hue, s: parseFloat(scsColor.saturation) * 100, l: parseFloat(scsColor.lightness) * 100 },
        hsv: { h: hue, s: hsv.s * 100, v: hsv.v * 100 },
        lrv: parseFloat(scsColor.lrv)
    };
};

export const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    const rPrime = r / 255;
    const gPrime = g / 255;
    const bPrime = b / 255;

    const cMax = Math.max(rPrime, gPrime, bPrime);
    const cMin = Math.min(rPrime, gPrime, bPrime);
    const delta = cMax - cMin;

    const h = +
        delta === 0 ? 0 :
        cMax === rPrime ? ((gPrime - bPrime) / delta % 6) :
            cMax === gPrime ? ((bPrime - rPrime) / delta + 2) :
                ((rPrime - gPrime) / delta + 4);

    const s =
        cMax === 0 ? 0 :
            delta / cMax;

    const v = cMax;

    return {
        h: h,
        s: s,
        v: v
    };
}

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
