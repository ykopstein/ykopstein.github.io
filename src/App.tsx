import { Button, TextField } from '@mui/material';
import './App.css'
import type { AxisMetatadata } from './sherwinWilliams/api/types';
import AxisMetatadataSelector from './sherwinWilliams/components/AxisMetadataSelector';
import ScsColorSelector from './sherwinWilliams/components/ScsColorSelector'
import ScsScatterPlot from './sherwinWilliams/components/ScsScatterPlot';
import { useState } from 'react';
import ColorTagManager from './sherwinWilliams/components/ColorTagManager';
import { getTaggedColors, getTags } from './sherwinWilliams/api/colorTagging';

function App() {
    const [showSelector, setShowSelector] = useState(false);
    const [showScatterPlot, setShowScatterPlot] = useState(false);
    const [showTagManager, setShowTagManager] = useState(false);
    const [tag, setTag] = useState('');
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

            <button onClick={() => setShowSelector(!showSelector)}>
                {showSelector ? 'Close' : 'Open'} Color Search
            </button>
            <button onClick={() => setShowScatterPlot(!showScatterPlot)}>
                {showScatterPlot ? 'Close' : 'Open'} Scatterplot
            </button>
            <button onClick={() => setShowTagManager(!showTagManager)}>
                {showTagManager ? 'Close' : 'Open'} Tag Manager
            </button>

            <div hidden={!showSelector}>
                <ScsColorSelector
                    onSelect={() => { }}
                />
            </div>

            <div hidden={!showScatterPlot}>
                <div>
                    <AxisMetatadataSelector onSelect={axis => setXAxis(axis)} />
                    <AxisMetatadataSelector onSelect={axis => setYAxis(axis)} />
                    <TextField value={tag} onChange={e => setTag(e.target.value) } />
                    <Button onClick={async () => await refreshTaggedColors()}>Refresh</Button>
                </div>

                <ScsScatterPlot
                    colors={taggedColors}
                    xAxis={xAxis}
                    yAxis={yAxis} />
            </div>

            <div hidden={!showTagManager}>
                <ColorTagManager></ColorTagManager>
            </div>
        </>
    );
}

export default App
