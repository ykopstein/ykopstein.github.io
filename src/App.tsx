import { Box, Button, Tab, Tabs } from '@mui/material';
import './App.css'
import type { AxisMetatadata } from './sherwinWilliams/api/types';
import AxisMetatadataSelector from './sherwinWilliams/components/AxisMetadataSelector';
import ScsColorSelector from './sherwinWilliams/components/ScsColorSelector'
import ScsScatterPlot from './sherwinWilliams/components/ScsScatterPlot';
import { useState } from 'react';
import ColorTagManager from './sherwinWilliams/components/ColorTagManager';
import { getTaggedColors, getTags } from './sherwinWilliams/api/colorTagging';

function App() {
    const [tabIndex, setTabIndex] = useState(0);
    const [taggedColors, setTaggedColors] = useState<{ code: string, displayHex: string }[]>([]);
    const [xAxis, setXAxis] = useState<AxisMetatadata | undefined>();
    const [yAxis, setYAxis] = useState<AxisMetatadata | undefined>();

    const refreshTaggedColors = async () => {
        const taggedColors = getTaggedColors();
        const tags = getTags();

        setTaggedColors(taggedColors.map(x => ({
            code: x.colorCode,
            displayHex: tags.find(t => t.tag === x.tag)?.displayColorHex ?? ''
        })));
    };

    return (
        <>
            <h2>Sherwin Williams Color Info</h2>

            <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)}>
                <Tab label="Color Search" />
                <Tab label="Scatterplot" />
                <Tab label="Tag Manager" />
            </Tabs>

            <Box hidden={tabIndex !== 0}>
                <ScsColorSelector
                    onSelect={() => { }}
                />
            </Box>

            <Box hidden={tabIndex !== 1}>
                <div>
                    <AxisMetatadataSelector onSelect={axis => setXAxis(axis)} />
                    <AxisMetatadataSelector onSelect={axis => setYAxis(axis)} />
                    <Button onClick={async () => await refreshTaggedColors()}>Refresh</Button>
                </div>

                <ScsScatterPlot
                    colors={taggedColors}
                    xAxis={xAxis}
                    yAxis={yAxis} />
            </Box>

            <Box hidden={tabIndex !== 2}>
                <ColorTagManager></ColorTagManager>
            </Box>
        </>
    );
}

export default App
