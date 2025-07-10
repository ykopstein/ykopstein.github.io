import { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type IColorMetadata } from "../api/types";

export interface ScsColorSelectorProps {
    onSelect: (colorCode: string) => void;
}

function ScsColorSelector({ onSelect }: ScsColorSelectorProps) {
    const [rows, setRows] = useState<IColorMetadata[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [colorCodeText, setColorCodeText] = useState<string>('');

    useEffect(() => {
        (async () => {
            const response = await fetch('/colorLookup.json');
            if (!response.ok) {
                console.error('Failed to fetch color lookup data');
                return;
            }

            const data: IColorMetadata[] = await response.json();
            setRows(data);
            setLoading(false);
        })();
    }, []);

    const columns: GridColDef[] = [
        { field: 'number', headerName: 'SW Color #', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'rgb', headerName: 'RGB', valueFormatter: x => `(${x.r}, ${x.g}, ${x.b})`, width: 150, sortable: true, filterable: true },
        { field: 'hsl', headerName: 'HSL', valueFormatter: x => `(${x.h}, ${x.s}, ${x.l})`, width: 150, sortable: true, filterable: true },
        { field: 'hsv', headerName: 'HSV', valueFormatter: x => `(${x.h}, ${x.s}, ${x.v})`, width: 150, sortable: true, filterable: true },
        { field: 'lrv', headerName: 'LRV', width: 100, sortable: true, filterable: true },
    ];

    return (
        // <div>
        //     <input
        //         type="text"
        //         placeholder="Enter color code eg SW7602"
        //         value={colorCodeText}
        //         onChange={e => setColorCodeText(e.target.value)}
        //         onKeyDown={e => e.key === 'Enter' && onSelect(colorCodeText)} />
        //     <button onClick={() => onSelect(colorCodeText)}>Update</button>
        // </div>
        <DataGrid
            rows={rows.map(row => ({ ...row, id: row.number }))}
            columns={columns}
            loading={loading}
            paginationModel={{ pageSize: 10, page: 0 }}
            filterMode="client"
            sortingMode="client"
            onRowDoubleClick={e => onSelect(e.id.toString())} />
    );
}

export default ScsColorSelector;
