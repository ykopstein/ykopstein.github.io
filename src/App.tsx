import './App.css'
import type { AxisMetatadata } from './sherwinWilliams/api/types';
import AxisMetatadataSelector from './sherwinWilliams/components/AxisMetadataSelector';
import ScsColorDetails from './sherwinWilliams/components/ScsColorDetails'
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {
                    selectedColorCodes.map((colorCode, index) => (
                        <Card key={index}>
                            <CardContent>
                                <ScsColorDetails
                                    colorCode={colorCode}
                                    onColorLink={code => setSelectedColorCodes([...selectedColorCodes, code])}
                                />
                            </CardContent>
                            <CardActions>
                                <button onClick={() => {
                                    setSelectedColorCodes(selectedColorCodes.filter(code => code !== colorCode));
                                }}>Remove</button>
                            </CardActions>
                        </Card>
                    ))
                }
            </div>

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
