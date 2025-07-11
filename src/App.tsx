import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css'
import ScsColorDetails from './sherwinWilliams/components/ScsColorDetails'
import ScsColorSelector from './sherwinWilliams/components/ScsColorSelector'
import { useState } from 'react';

function SwColorInfoRoute() {
    const [showSelector, setShowSelector] = useState(false);
    const { colorCode } = useParams<{ colorCode: string }>();
    const navigate = useNavigate();

    return (
        <>
            <h2>Sherwin Williams Color Info</h2>

            <button onClick={() => setShowSelector(!showSelector)}>
                {showSelector ? 'Close' : 'Open'} Color Search
            </button>
            <div hidden={!showSelector}>
                <ScsColorSelector
                    onSelect={code => navigate(`/color/${code}`)}
                />
            </div>
            <ScsColorDetails
                colorCode={colorCode || ''}
                onColorLink={code => navigate(`/color/${code}`)}
            />
        </>
    );
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/color/:colorCode" element={<SwColorInfoRoute />} />
                    <Route path="*" element={<SwColorInfoRoute />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App
