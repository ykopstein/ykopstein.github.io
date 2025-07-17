import { Card, CardActions, CardContent } from "@mui/material";
import ScsColorDetails from "./ScsColorDetails";

export interface ScsColorDetailsListProps {
    colorCodes: string[];
    onAdd: (colorCode: string) => void;
    onRemove: (colorCode: string) => void;
}

function ScsColorDetailsList({ colorCodes, onAdd, onRemove }: ScsColorDetailsListProps) {
    return (<>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {
                colorCodes.map((colorCode, index) => (
                    <Card key={index}>
                        <CardContent>
                            <ScsColorDetails
                                colorCode={colorCode}
                                onColorLink={code => onAdd(code)}
                            />
                        </CardContent>
                        <CardActions>
                            <button onClick={() => onRemove(colorCode) }>Remove</button>
                        </CardActions>
                    </Card>
                ))
            }
        </div>
    </>);
}

export default ScsColorDetailsList;
