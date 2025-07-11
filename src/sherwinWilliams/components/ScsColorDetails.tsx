import { type SharedColorServiceColor, type IColorLinkInfo, type IColorMetadata } from '../api/types';
import { getColor, calculateMetadata } from '../api/sharedColorService';
import { useEffect, useState } from "react";

export interface ScsColorDetailsProps {
    colorCode: string;
    onColorLink: (colorCode: string) => void;
}

function ScsColorDetails({ colorCode, onColorLink }: ScsColorDetailsProps) {
    const [scsColor, setScsColor] = useState<SharedColorServiceColor | null>(null);
    const [colorMetadata, setColorMetadata] = useState<IColorMetadata | null>(null);

    useEffect(() => {
        if(!colorCode) return;

        (async () => {
            const scsColor = await getColor(colorCode);
            if(scsColor === null) return;
            
            setScsColor(scsColor);

            const metadata = calculateMetadata(scsColor);
            setColorMetadata(metadata);
        })();
    }, [colorCode]);

    return (
        <div className="sw-color-info">            
            {scsColor === null || colorMetadata === null ?
                (<p>No color selected</p>) :
                (<>
                    <h3 style={{ textAlign: "left" }}>{scsColor.name} ({scsColor.colorNumber})</h3>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <div style={{
                            backgroundColor: `#${scsColor.hex}`,
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%'
                        }}></div>
                        <ul style={{ textAlign: "left" }}>
                            <li>Hex #{colorMetadata.hex}</li>
                            <li>RGB ({colorMetadata.rgb.r}, {colorMetadata.rgb.g}, {colorMetadata.rgb.b})</li>
                            <li>HSL ({colorMetadata.hsl.h.toFixed(1)}, {(colorMetadata.hsl.s).toFixed(1)}, {(colorMetadata.hsl.l).toFixed(1)})</li>
                            <li>HSV ({colorMetadata.hsv.h.toFixed(1)}, {(colorMetadata.hsv.s).toFixed(1)}, {(colorMetadata.hsv.v).toFixed(1)})</li>
                            <li>LRV {(colorMetadata.lrv).toFixed(1)}</li>
                        </ul>

                        <ColorLinkList
                            title="Coordinating Colors"
                            colors={scsColor.coordinatingColors}
                            onClick={code => onColorLink(code)}
                        ></ColorLinkList>

                        <ColorLinkList
                            title="Color Strip Colors"
                            colors={scsColor.colorStripColors}
                            onClick={code => onColorLink(code)}
                        ></ColorLinkList>

                        <ColorLinkList
                            title="Similar Colors"
                            colors={scsColor.similarColors}
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

export default ScsColorDetails;
