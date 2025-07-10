import { useState } from 'react';
import { getColorInfo, toSwCodeString } from '../api/sharedColorService';

const getCacheKeys = (): string[] => [...Array(localStorage.length).keys()]
    .map(ix => localStorage.key(ix)!)
    .filter(key => key && key.startsWith('scs:color:'))
    .sort();

const findKeyGaps = (keys: string[]): { start: number, end: number }[] => {
    const keyNumbers = keys.map(key => parseInt(key.substr(12,4)));
    
    const gaps: { start: number, end: number }[] = [];
    for (let i = 1; i <= keyNumbers.length; i++) {
        if(keyNumbers[i - 1] + 1 !== keyNumbers[i]) {
            gaps.push({ start: keyNumbers[i - 1] + 1, end: keyNumbers[i] - 1 });
        }
    }

    return gaps;
}

function ScsColorDownloader() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [minCode, setMinCode] = useState<string>('');
    const [maxCode, setMaxCode] = useState<string>('');
    const [cacheKeys, setCacheKeys] = useState<string[]>(getCacheKeys());         

    const keyGaps = findKeyGaps(cacheKeys);

    const downloadCodes = async () => {
        if (minCode === undefined || maxCode === undefined) {
            alert('Please enter both min and max codes.');
            return;
        }

        setIsLoading(true);
        for (let code = parseInt(minCode); code <= parseInt(maxCode); code++) {
            await getColorInfo(toSwCodeString(code));
        }
        setIsLoading(false);
    };

    return (<>
        <button onClick={() => setIsPanelOpen(!isPanelOpen)}>
            {isPanelOpen ? 'Close' : 'Open'} Color Downloader
        </button>
        <div style={{ display: isPanelOpen ? 'block' : 'none' }}>
            <div>
                <input placeholder="Min Code" value={minCode} onChange={e => setMinCode(e.target.value)} />
                <input placeholder="Max Code" value={maxCode} onChange={e => setMaxCode(e.target.value)} />
            </div>

            <button disabled={isLoading} onClick={async () => await downloadCodes()}>Download Codes</button>
            <button onClick={() => setCacheKeys(getCacheKeys())}>Refresh Cache Keys</button>
            <ul>
                {keyGaps.map(gap => (<li key={gap.start}>{toSwCodeString(gap.start)} - {toSwCodeString(gap.end)}</li>))}
            </ul>
        </div>
    </>);
}

export default ScsColorDownloader;
