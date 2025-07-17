import { MenuItem, Select } from "@mui/material";
import type { AxisMetatadata, IColorMetadata } from "../api/types";
import { useState } from "react";

const options: AxisMetatadata[] = [
    { metricName: 'LCH - Luminosity', accessor: (m: IColorMetadata) => m.lch.l },
    { metricName: 'LCH - Chroma', accessor: (m: IColorMetadata) => m.lch.c },
    { metricName: 'LCH - Hue', accessor: (m: IColorMetadata) => m.lch.h },
    { metricName: 'LRV', accessor: (m: IColorMetadata) => m.lrv },
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
