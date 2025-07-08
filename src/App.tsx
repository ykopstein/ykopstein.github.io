import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css'
import ScsColorDetails from './sherwinWilliams/components/ScsColorDetails'
import ScsColorSelector from './sherwinWilliams/components/ScsColorSelector'
import ScsColorDownloader from './sherwinWilliams/components/ScsColorDownloader';

function SwColorInfoRoute() {
    const { colorCode } = useParams<{ colorCode: string }>();
    const navigate = useNavigate();

    return (
        <>
            <h2>Sherwin Williams Color Info</h2>
            <ScsColorSelector
                colorCode={colorCode || ''}
                onSelect={code => navigate(`/color/${code}`)}
            />
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
            <ScsColorDownloader></ScsColorDownloader>
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
