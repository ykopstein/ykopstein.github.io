import { useEffect, useState } from "react";

interface IColorLinkInfo {
    number: string;
    name: string;
    hex: string;
}

interface CoordinatingColor extends IColorLinkInfo {
    number: string;
    isDark: string; // "True" or "False"
    name: string;
    colorUrl: string;
    hex: string;
}

interface ColorStripColor extends IColorLinkInfo {
    number: string;
    isDark: string;
    stripNumber: string;
    name: string;
    colorUrl: string;
    hex: string;
    stripPostion: string;
}

interface SimilarColor extends IColorLinkInfo {
    number: string;
    isDark: string;
    name: string;
    colorUrl: string;
    hex: string;
}

interface AttributeValue {
    value: string;
}

interface Attribute {
    identifier: string;
    attributeValues: AttributeValue[];
}

interface Lab {
    A: string;
    B: string;
    L: string;
}

export interface SwColorInfo {
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

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
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

export interface SwColorInfoProps {
    colorCode: string;
    onColorLink: (colorCode: string) => void;
}

function SwColorInfo({ colorCode, onColorLink }: SwColorInfoProps) {
    const [colorInfo, setColorInfo] = useState<SwColorInfo | null>(null);
    const [calculatedColorInfo, setCalculatedColorInfo] = useState<{ hue: number; lightness: number; saturationForHsv: number; value: number, saturationForHsl: number, lrv: number } | null>(null);

    const dlColorInfoFromSw = async (colorCode: string): Promise<SwColorInfo> => {
        const response = await fetch(`https://api.sherwin-williams.com/shared-color-service/color/byColorNumber/${colorCode}`);
        const json = await response.json();

        return json as SwColorInfo;
    };

    useEffect(() => {
        if(!colorCode) return;

        (async () => {
            const colorInfo = await dlColorInfoFromSw(colorCode);
            setColorInfo(colorInfo);
        
            const pcntHue = parseFloat(colorInfo.hue);
            const hue = pcntHue * 360;
        
            const r = parseInt(colorInfo.red, 10);
            const g = parseInt(colorInfo.green, 10);
            const b = parseInt(colorInfo.blue, 10);
        
            const hsv = rgbToHsv(r, g, b);
            setCalculatedColorInfo({
                hue: hue,
                lightness: parseFloat(colorInfo.lightness),
                saturationForHsv: hsv.s,
                value: hsv.v,
                saturationForHsl: parseFloat(colorInfo.saturation),
                lrv: parseFloat(colorInfo.lrv)
            });
        })();
    }, [colorCode]);

    return (
        <div className="sw-color-info">            
            {colorInfo === null || calculatedColorInfo === null ?
                (<p>No color selected</p>) :
                (<>
                    <h3 style={{ textAlign: "left" }}>{colorInfo.name} ({colorInfo.colorNumber})</h3>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <div style={{
                            backgroundColor: `#${colorInfo.hex}`,
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%'
                        }}></div>
                        <ul style={{ textAlign: "left" }}>
                            <li>Hex #{colorInfo.hex}</li>
                            <li>RGB ({colorInfo.red}, {colorInfo.green}, {colorInfo.blue})</li>
                            <li>HSL ({calculatedColorInfo.hue.toFixed(1)}, {(calculatedColorInfo.saturationForHsl * 100).toFixed(1)}, {(calculatedColorInfo.lightness * 100).toFixed(1)})</li>
                            <li>HSV ({calculatedColorInfo.hue.toFixed(1)}, {(calculatedColorInfo.saturationForHsv * 100).toFixed(1)}, {(calculatedColorInfo.value * 100).toFixed(1)})</li>
                            <li>LRV {(calculatedColorInfo.lrv).toFixed(1)}</li>
                        </ul>

                        <ColorLinkList
                            title="Coordinating Colors"
                            colors={colorInfo.coordinatingColors}
                            onClick={code => onColorLink(code)}
                        ></ColorLinkList>

                        <ColorLinkList
                            title="Color Strip Colors"
                            colors={colorInfo.colorStripColors}
                            onClick={code => onColorLink(code)}
                        ></ColorLinkList>

                        <ColorLinkList
                            title="Similar Colors"
                            colors={colorInfo.similarColors}
                            onClick={code => onColorLink(code)}
                        ></ColorLinkList>
                    </div>
                </>)
            }
        </div >
    );
}

interface ColorLinkListProps {
    title: string;
    colors: IColorLinkInfo[];
    onClick: (code: string) => void;
}

function ColorLinkList({ title, colors, onClick }: ColorLinkListProps) {
    return (
        <ul style={{ textAlign: "left", listStyleType: 'none' }}>
            <li>
                <h4>{title}</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {colors.map(color =>
                    (<li key={color.number}>
                        <ColorLink color={color} onClick={onClick}></ColorLink>
                    </li>)
                    )}
                </ul>
            </li>
        </ul>
    );
}

interface ColorLinkProps {
    color: IColorLinkInfo;
    onClick: (code: string) => void;
}

function ColorLink({ color, onClick }: ColorLinkProps) {
    return (<>
        <div onClick={() => onClick(color.number)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <div style={{
                backgroundColor: `#${color.hex}`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                marginRight: '10px'
            }}></div>
            <div>{color.number} - {color.name}</div>
        </div>
    </>)
}

export default SwColorInfo;
