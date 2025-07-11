import { type IColorMetadata, type SharedColorServiceColor } from "./types";
import { rgbToXyz, xyzToLab, labToLch, rgbToHsv } from "./colorConversion";
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

    const xyz = rgbToXyz({ r: r, g: g, b: b });
    const lab = xyzToLab(xyz);
    const lch = labToLch(lab);
    
    return {
        number: scsColor.colorNumber,
        name: scsColor.name,
        hex: scsColor.hex,
        rgb: { r: r, g: g, b: b },
        hsl: { h: hue, s: parseFloat(scsColor.saturation) * 100, l: parseFloat(scsColor.lightness) * 100 },
        hsv: { h: hue, s: hsv.s * 100, v: hsv.v * 100 },
        lab: lab,
        lch: lch,
        lrv: parseFloat(scsColor.lrv)
    };
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
