import { useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridFilterInputValueProps, type GridFilterOperator, type GridRowParams, type GridValidRowModel, type MuiEvent } from "@mui/x-data-grid";
import TextField from '@mui/material/TextField';
import { type IColorMetadata, type ILch } from "../api/types";
import { getColorMetadataLookup } from "../api/colorMetadata";
import { getTaggedColors, getTags, tagColor } from "../api/colorTagging";
import { Button, Select, MenuItem } from "@mui/material";

export interface ScsColorSelectorProps {
    onSelect: (colorCode: string) => void;
}

const create3ValOperator = <T extends GridValidRowModel>(props: Pick<_3ValFilterInputProps, 'aPropName' | 'bPropName' | 'cPropName'>): GridFilterOperator<T, any, any, _3ValFilterInputProps> => {
    return {
        label: 'Range',
        value: '3Val',
        getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) {
                return null;
            }

            const filter = filterItem.value as _3ValFilter;
            return (value): boolean => {
                if (!value[props.aPropName] || !value[props.bPropName] || !value[props.cPropName]) {
                    return false;
                }

                if (filter.a.max && value[props.aPropName] > filter.a.max) return false;
                if (filter.a.min && value[props.aPropName] < filter.a.min) return false;
                if (filter.b.max && value[props.bPropName] > filter.b.max) return false;
                if (filter.b.min && value[props.bPropName] < filter.b.min) return false;
                if (filter.c.max && value[props.cPropName] > filter.c.max) return false;
                if (filter.c.min && value[props.cPropName] < filter.c.min) return false;

                return true;
            };
        },
        InputComponent: _3ValFilterInput,
        InputComponentProps: props
    };
};

interface _3ValFilter {
    a: { min: number | undefined, max: number | undefined };
    b: { min: number | undefined, max: number | undefined };
    c: { min: number | undefined, max: number | undefined };
}

interface _3ValFilterInputProps extends GridFilterInputValueProps {
    aPropName: string;
    bPropName: string;
    cPropName: string;
}

function _3ValFilterInput({ aPropName, bPropName, cPropName, applyValue, item }: _3ValFilterInputProps) {
    const filter = item.value as _3ValFilter | undefined;
    const [aMinVal, setAMinVal] = useState<string>(filter?.a.min?.toString() ?? '');
    const [aMaxVal, setAMaxVal] = useState<string>(filter?.a.max?.toString() ?? '');
    const [bMinVal, setBMinVal] = useState<string>(filter?.b.min?.toString() ?? '');
    const [bMaxVal, setBMaxVal] = useState<string>(filter?.b.max?.toString() ?? '');
    const [cMinVal, setCMinVal] = useState<string>(filter?.c.min?.toString() ?? '');
    const [cMaxVal, setCMaxVal] = useState<string>(filter?.c.max?.toString() ?? '');

    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><TextField label={`${aPropName} min`} value={aMinVal} onChange={e => setAMinVal(e.target.value)} /> <TextField label={`${aPropName} max`} value={aMaxVal} onChange={e => setAMaxVal(e.target.value)} /></li>
            <li><TextField label={`${bPropName} min`} value={bMinVal} onChange={e => setBMinVal(e.target.value)} /> <TextField label={`${bPropName} max`} value={bMaxVal} onChange={e => setBMaxVal(e.target.value)} /></li>
            <li><TextField label={`${cPropName} min`} value={cMinVal} onChange={e => setCMinVal(e.target.value)} /> <TextField label={`${cPropName} max`} value={cMaxVal} onChange={e => setCMaxVal(e.target.value)} /></li>
            <li>
                <button onClick={() => {
                    const filter: _3ValFilter = {
                        a: { min: parseNumOrUndefined(aMinVal), max: parseNumOrUndefined(aMaxVal) },
                        b: { min: parseNumOrUndefined(bMinVal), max: parseNumOrUndefined(bMaxVal) },
                        c: { min: parseNumOrUndefined(cMinVal), max: parseNumOrUndefined(cMaxVal) },
                    };

                    applyValue({ ...item, value: filter });
                }}>Apply Filter</button>
            </li>
        </ul>
    );
}

const createRangeOperator = <T extends GridValidRowModel>(): GridFilterOperator<T, any, any, RangeFilterInputProps> => {
    return {
        label: 'Range',
        value: '3Val',
        getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) {
                return null;
            }

            const filter = filterItem.value as RangeFilter;
            return (value): boolean => {
                if (!value) {
                    return false;
                }

                if (filter.max && value > filter.max) return false;
                if (filter.min && value < filter.min) return false;

                return true;
            };
        },
        InputComponent: RangeFilterInput
    };
};

interface RangeFilter {
    min: number | undefined;
    max: number | undefined;
}

interface RangeFilterInputProps extends GridFilterInputValueProps {
}

function RangeFilterInput({ applyValue, item }: RangeFilterInputProps) {
    const filter = item.value as RangeFilter | undefined;
    const [minVal, setMinVal] = useState<string>(filter?.min?.toString() ?? '');
    const [maxVal, setMaxVal] = useState<string>(filter?.max?.toString() ?? '');

    return (<>
        <TextField
            label='min'
            value={minVal}
            onChange={e => setMinVal(e.target.value)} />
        <TextField
            label='max'
            value={maxVal}
            onChange={e => setMaxVal(e.target.value)} />

        <button onClick={() => {
            const filter: RangeFilter = {
                min: parseNumOrUndefined(minVal),
                max: parseNumOrUndefined(maxVal)
            };

            applyValue({ ...item, value: filter });
        }}>Apply</button>
    </>);
}

const parseNumOrUndefined = (val: string): number | undefined => {
    if (!val) {
        return undefined;
    }

    const parsed = parseInt(val);
    if (isNaN(parsed)) {
        return undefined;
    }

    return parsed;
}

function ScsColorSelector({ onSelect }: ScsColorSelectorProps) {
    const [rows, setRows] = useState<IColorMetadata[]>([]);
    const [undertonesWithPendingChanges, setUndertonesWithPendingChanges] = useState<{ [code: string]: string }>(getTaggedColors().reduce((obj, entry) => { obj[entry.colorCode] = entry.tag; return obj; }, {} as { [code: string]: string }));
    const [loading, setLoading] = useState<boolean>(false);
    const undertones = getTags().map(x => x.tag);

    const handleUndertoneTextChange = (colorCode: string, newText: string) => {
        setUndertonesWithPendingChanges(prev => ({ ...prev, [colorCode]: newText }));
    };

    const applyPendingUndertoneChanges = () => {
        for (const key in undertonesWithPendingChanges) {
            tagColor(key, undertonesWithPendingChanges[key]);
        }
    };

    useEffect(() => {
        (async () => {
            const lookup = await getColorMetadataLookup();
            setRows(lookup);

            setLoading(false);
        })();
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'swatch', headerName: 'Swatch', renderCell: params => (<div style={{
                backgroundColor: `#${params.row.hex}`,
                width: '100%',
                height: '100%'
            }}></div>)
        },
        { field: 'number', headerName: 'SW Color #', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'lch', headerName: 'LCH', valueFormatter: (x: ILch) => `(${x.l.toFixed(1)}, ${x.c.toFixed(1)}, ${x.h.toFixed(1)})`, width: 150, filterable: true, filterOperators: [create3ValOperator<ILch>({ aPropName: 'l', bPropName: 'c', cPropName: 'h' })] },
        { field: 'lrv', headerName: 'LRV', width: 100, filterable: true, filterOperators: [createRangeOperator()] },
        {
            field: 'undertone',
            headerName: 'Undertone',
            width: 250,
            renderCell: params => (
                <Select
                    value={undertonesWithPendingChanges[params.row.number] ?? ''}
                    onChange={e => handleUndertoneTextChange(params.row.number.toString(), e.target.value)}
                >
                    {undertones.map(u => (
                        <MenuItem value={u}>{u}</MenuItem>
                    ))}
                </Select>
            )
        }
    ];

    const handleRowDoubleClick = (params: GridRowParams, _: MuiEvent<React.MouseEvent<HTMLElement>>) => {
        onSelect(params.row.number.toString());
    };

    return (<>
        <Button onClick={() => applyPendingUndertoneChanges()}>Save Tags</Button>
        <DataGrid
            rows={rows.map(row => ({ ...row, id: row.number }))}
            columns={columns}
            loading={loading}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10, page: 0 }
                }
            }}
            onRowDoubleClick={handleRowDoubleClick}
            showToolbar />
    </>);
}

export default ScsColorSelector;
