import './App.css'
import ScsColorDetails from './sherwinWilliams/components/ScsColorDetails'
import ScsColorSelector from './sherwinWilliams/components/ScsColorSelector'
import { Card, CardHeader, CardContent, CardActions } from '@mui/material';
import { useState } from 'react';

function App() {
    const [showSelector, setShowSelector] = useState(false);
    const [selectedColorCodes, setSelectedColorCodes] = useState<string[]>([]);

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

            {selectedColorCodes.length === 0 && (
                <p>No colors selected. Please select a color to view details.</p>
            )}
        </>
    );
}

export default App
