export interface IColorLinkInfo {
    number: string;
    name: string;
    hex: string;
}

export interface IRgb {
    r: number;
    g: number;
    b: number;
}

export interface IHsl {
    h: number;
    s: number;
    l: number;
}

export interface IHsv {
    h: number;
    s: number;
    v: number; 
}

export interface IColorMetadata {
    number: string;
    name: string;
    hex: string;
    rgb: IRgb;
    hsl: IHsl;
    hsv: IHsv;
    lrv: number;
}

export interface CoordinatingColor extends IColorLinkInfo {
    number: string;
    isDark: string; // "True" or "False"
    name: string;
    colorUrl: string;
    hex: string;
}

export interface ColorStripColor extends IColorLinkInfo {
    number: string;
    isDark: string;
    stripNumber: string;
    name: string;
    colorUrl: string;
    hex: string;
    stripPostion: string;
}

export interface SimilarColor extends IColorLinkInfo {
    number: string;
    isDark: string;
    name: string;
    colorUrl: string;
    hex: string;
}

export interface AttributeValue {
    value: string;
}

export interface Attribute {
    identifier: string;
    attributeValues: AttributeValue[];
}

export interface Lab {
    A: string;
    B: string;
    L: string;
}

export interface SharedColorServiceColor {
    colorNumber: string;
    colorNumberDisplay: string;
    coordinatingColors: CoordinatingColor[];
    description: string[];
    id: number;
    displayOrder: number | null;
    name: string;
    lrv: string;
    brandedCollectionNames: string[];
    colorFamilyNames: string[];
    brandKey: string;
    red: string;
    green: string;
    blue: string;
    hue: string;
    saturation: string;
    lightness: string;
    hex: string;
    isDark: string;
    storeStripLocator: string | null;
    colorStripColors: ColorStripColor[];
    similarColors: SimilarColor[];
    ignore: string;
    status: string;
    lab: Lab;
    attributes: Attribute[];
    isExterior: boolean;
    isInterior: boolean;
}
