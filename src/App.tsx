import './App.css'
import type { AxisMetatadata } from './sherwinWilliams/api/types';
import AxisMetatadataSelector from './sherwinWilliams/components/AxisMetadataSelector';
import ScsColorDetails from './sherwinWilliams/components/ScsColorDetails'
import ScsColorDetailsList from './sherwinWilliams/components/ScsColorDetailsList';
import ScsColorSelector from './sherwinWilliams/components/ScsColorSelector'
import ScsScatterPlot from './sherwinWilliams/components/ScsScatterPlot';
import { Card, CardContent, CardActions } from '@mui/material';
import { useState } from 'react';

function App() {
    const [showSelector, setShowSelector] = useState(false);
    const [selectedColorCodes, setSelectedColorCodes] = useState<string[]>([]);
    const [xAxis, setXAxis] = useState<AxisMetatadata | undefined>();
    const [yAxis, setYAxis] = useState<AxisMetatadata | undefined>();

    return (
        <>
            <h2>Sherwin Williams Color Info</h2>

            <button onClick={() => setShowSelector(!showSelector)}>
                {showSelector ? 'Close' : 'Open'} Color Search
            </button>
            <div hidden={!showSelector}>
                <ScsColorSelector
                    onSelect={code => setSelectedColorCodes([...selectedColorCodes, code])}
                />
            </div>

            <ScsColorDetailsList
                colorCodes={selectedColorCodes}
                onAdd={code => setSelectedColorCodes([...selectedColorCodes, code])}
                onRemove={colorCode => setSelectedColorCodes(selectedColorCodes.filter(code => code !== colorCode))}
            />

            <div>
                <div>
                    <AxisMetatadataSelector onSelect={axis => setXAxis(axis)} />
                    <AxisMetatadataSelector onSelect={axis => setYAxis(axis)} />
                </div>
            </div>
            <ScsScatterPlot
                colorCodes={selectedColorCodes}
                xAxis={xAxis}
                yAxis={yAxis} />

            {selectedColorCodes.length === 0 && (
                <p>No colors selected. Please select a color to view details.</p>
            )}
        </>
    );
}

export default App
