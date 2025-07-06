import { useState } from 'react';
import './App.css'
import SwColorInfo from './components/SwColorInfo'
import SwColorSelector from './components/SwColorSelector'

function App() {
  const [colorCode, setColorCode] = useState<string>('');
  
  return (
    <>
            <h2>Sherwin Williams Color Info</h2>
            <SwColorSelector onSelect={colorCode => setColorCode(colorCode)} colorCode={colorCode}></SwColorSelector>
            <SwColorInfo colorCode={colorCode} onColorLink={colorCode => setColorCode(colorCode)}></SwColorInfo>
    </>
  )
}

export default App
