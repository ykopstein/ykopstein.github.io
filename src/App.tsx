import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css'
import SwColorInfo from './components/SwColorInfo'
import SwColorSelector from './components/SwColorSelector'

function SwColorInfoRoute() {
    const { colorCode } = useParams<{ colorCode: string }>();
    const navigate = useNavigate();

    return (
        <>
            <h2>Sherwin Williams Color Info</h2>
            <SwColorSelector
                colorCode={colorCode || ''}
                onSelect={code => navigate(`/color/${code}`)}
            />
            <SwColorInfo
                colorCode={colorCode || ''}
                onColorLink={code => navigate(`/color/${code}`)}
            />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/color/:colorCode" element={<SwColorInfoRoute />} />
                <Route path="*" element={<SwColorInfoRoute />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
