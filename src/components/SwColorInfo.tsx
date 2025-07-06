import { useState } from "react";

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

const hslToHsv = (h: number, s: number, l: number): { h: number; s: number; v: number } => {
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    let v = l + s * Math.min(l, 1 - l);
    let newS = v === 0 ? 0 : 2 * (1 - l / v);

    return {
        h: h,
        s: (newS * 100),
        v: (v * 100)
    };
};

function SwColorInfo() {
    const [colorCodeText, setColorCodeText] = useState<string>('');
    const [colorInfo, setColorInfo] = useState<SwColorInfo | null>(null);
    const [hsv, setHsv] = useState<{ h: number; s: number; v: number } | null>(null);

    const dlColorInfoFromSw = async (colorCode: string): Promise<SwColorInfo> => {
        const response = await fetch(`https://api.sherwin-williams.com/shared-color-service/color/byColorNumber/${colorCode}`);
        const json = await response.json();

        return json as SwColorInfo;
    };

    const setColorCode = async (code: string) => {
        setColorCodeText(code);

        const colorInfo = await dlColorInfoFromSw(code);
        setColorInfo(colorInfo);

        const hsv = hslToHsv(parseFloat(colorInfo.hue), parseFloat(colorInfo.saturation) / 100, parseFloat(colorInfo.lightness) / 100);
        setHsv(hsv);
    };

    return (
        <div className="sw-color-info">
            <h2>Sherwin Williams Color Info</h2>
            <input type="text" placeholder="Enter color code eg SW7602" value={colorCodeText} onChange={e => setColorCodeText(e.target.value)} />
            <button onClick={() => setColorCode(colorCodeText)}>Update</button>
            {colorInfo === null || hsv === null ?
                (<p>Enter a color</p>) :
                (<>
                    <h3 style={{ textAlign: "left" }}>{colorInfo.name}</h3>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <div style={{
                            backgroundColor: `#${colorInfo.hex}`,
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%'
                        }}></div>
                        <ul style={{ textAlign: "left" }}>
                            <li>RGB ({colorInfo.red}, {colorInfo.green}, {colorInfo.blue})</li>
                            <li>HSL ({colorInfo.hue}, {colorInfo.saturation}, {colorInfo.lightness})</li>
                            <li>HSV ({colorInfo.hue}, {hsv.s}, {hsv.v})</li>
                        </ul>

                        <ColorLinkList
                            title="Coordinating Colors"
                            colors={colorInfo.coordinatingColors}
                            onClick={code => setColorCode(code)}
                        ></ColorLinkList>

                        <ColorLinkList
                            title="Color Strip Colors"
                            colors={colorInfo.colorStripColors}
                            onClick={code => setColorCode(code)}
                        ></ColorLinkList>

                        <ColorLinkList
                            title="Similar Colors"
                            colors={colorInfo.similarColors}
                            onClick={code => setColorCode(code)}
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
