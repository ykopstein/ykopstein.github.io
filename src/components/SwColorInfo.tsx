import { useState, useEffect } from "react";

interface CoordinatingColor {
    number: string;
    isDark: string; // "True" or "False"
    name: string;
    colorUrl: string;
    hex: string;
}

interface ColorStripColor {
    number: string;
    isDark: string;
    stripNumber: string;
    name: string;
    colorUrl: string;
    hex: string;
    stripPostion: string;
}

interface SimilarColor {
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

function SwColorInfo() {
    const [colorCode, setColorCode] = useState<string>('');
    const [colorInfo, setColorInfo] = useState<SwColorInfo | null>(null);

    const getColorInfo = async (colorCode: string): Promise<SwColorInfo> => {
        const response = await fetch(`https://api.sherwin-williams.com/shared-color-service/color/byColorNumber/${colorCode}`);
        const json = await response.json();

        return json as SwColorInfo;
    };

    const updateColorFromInput = async () => {
        const colorInfo = await getColorInfo(colorCode);
        setColorInfo(colorInfo);
    };

    return (
        <div className="sw-color-info">
            <h2>Sherwin Williams Color Info</h2>
            <input type="text" placeholder="Enter color code eg SW7602" value={colorCode} onChange={e => setColorCode(e.target.value)} />
            <button onClick={e => updateColorFromInput()}>Update</button>
            {colorInfo === null ?
                (<>Enter a color</>) :
                (<ul>
                    <li>{colorInfo.name}</li>
                    <li>R {colorInfo.red}</li>
                    <li>G {colorInfo.green}</li>
                    <li>B {colorInfo.blue}</li>
                    <li>H {colorInfo.hue}</li>
                    <li>S {colorInfo.saturation}</li>
                    <li>L {colorInfo.lightness}</li>
                </ul>)
            }
        </div >
    );
}

export default SwColorInfo;
