import { rgbToXyz, xyzToLab, labToLch, rgbToHsv } from "./colorConversion";
import { getColor } from "./sharedColorService";
import { type IColorMetadata, type SharedColorServiceColor } from "./types";

let _colorLookup: IColorMetadata[] | null = null;
export const getColorMetadataLookup = async (): Promise<IColorMetadata[]> => {
    if (_colorLookup === null) {
        const response = await fetch('/colorLookup.json');
        if (!response.ok) {
            throw new Error('Failed to fetch color lookup data');
        }

        _colorLookup = await response.json() as IColorMetadata[];
    }
    
    return _colorLookup;
}; 

export const getColorMetadata = async (colorCode: string): Promise<IColorMetadata | null> => {
    const lookup = await getColorMetadataLookup();
    const cachedMetadata = lookup.find(c => c.number === colorCode);
    if(cachedMetadata) return cachedMetadata;

    const color = await getColor(colorCode);
    if(color) {
        return calculateMetadata(color);
    } else {
        return null;
    }
};

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
