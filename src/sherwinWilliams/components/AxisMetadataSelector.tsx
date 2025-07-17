import { MenuItem, Select } from "@mui/material";
import type { AxisMetatadata, IColorMetadata } from "../api/types";
import { useState } from "react";

const options: AxisMetatadata[] = [
    { metricName: 'HSL - Hue', accessor: (m: IColorMetadata) => m.hsl.h },
    { metricName: 'HSL - Saturation', accessor: (m: IColorMetadata) => m.hsl.s },
    { metricName: 'HSL - Luminosity', accessor: (m: IColorMetadata) => m.hsl.l },
    { metricName: 'HSV - Hue', accessor: (m: IColorMetadata) => m.hsv.h },
    { metricName: 'HSV - Saturation', accessor: (m: IColorMetadata) => m.hsv.s },
    { metricName: 'HSV - Value', accessor: (m: IColorMetadata) => m.hsv.v },
    { metricName: 'LAB - Luminosity', accessor: (m: IColorMetadata) => m.lab.l },
    { metricName: 'LAB - A', accessor: (m: IColorMetadata) => m.lab.a },
    { metricName: 'LAB - B', accessor: (m: IColorMetadata) => m.lab.b },
    { metricName: 'LCH - Luminosity', accessor: (m: IColorMetadata) => m.lch.l },
    { metricName: 'LCH - Chroma', accessor: (m: IColorMetadata) => m.lch.c },
    { metricName: 'LCH - Hue', accessor: (m: IColorMetadata) => m.lch.h },
    { metricName: 'LRV', accessor: (m: IColorMetadata) => m.lrv },
    { metricName: 'RGB - Red', accessor: (m: IColorMetadata) => m.rgb.r },
    { metricName: 'RGB - Green', accessor: (m: IColorMetadata) => m.rgb.g },
    { metricName: 'RGB - Blue', accessor: (m: IColorMetadata) => m.rgb.b },
];

export interface AxisMetatadataSelectorProps {
    onSelect: (axis: AxisMetatadata) => void;
}

function AxisMetatadataSelector({ onSelect }: AxisMetatadataSelectorProps) {
    const [ixSelected, setIxSelected] = useState<number | undefined>();

    return (
        <Select
            value={ixSelected}
            onChange={e => {
                const ix = e.target.value as number;
                setIxSelected(ix);

                onSelect(options[ix]);
            }}>
            {options.map((option, ix) => (
                <MenuItem key={ix} value={ix}>
                    {option.metricName}
                </MenuItem>
            ))}
        </Select>
    );
}

export default AxisMetatadataSelector;
