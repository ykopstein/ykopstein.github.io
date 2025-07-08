import { useState } from 'react';
import { getColorInfo } from '../api/sharedColorService';

const getCacheKeys = (): string[] => [...Array(localStorage.length).keys()]
    .map(ix => localStorage.key(ix)!)
    .filter(key => key && key.startsWith('scs:color:'))
    .sort();

function ScsColorDownloader() {
    const [isLoading, setIsLoading] = useState(false);
    const [minCode, setMinCode] = useState<string | undefined>();
    const [maxCode, setMaxCode] = useState<string | undefined>();
    const [cacheKeys, setCacheKeys] = useState<string[]>(getCacheKeys());

    const downloadCodes = async () => {
        if (minCode === undefined || maxCode === undefined) {
            alert('Please enter both min and max codes.');
            return;
        }
        
        setIsLoading(true);
        for (let code = parseInt(minCode); code <= parseInt(maxCode); code++) {
            await getColorInfo(`SW${code}`);
        }
        setIsLoading(false);
    };

    return (<>
        <div>
            <input placeholder="Min Code" value={minCode} onChange={e => setMinCode(e.target.value)} />
            <input placeholder="Max Code" value={maxCode} onChange={e => setMaxCode(e.target.value)} />
        </div>

        <button disabled={isLoading} onClick={async () => await downloadCodes()}>Download Codes</button>
        <button onClick={() => setCacheKeys(getCacheKeys())}>Refresh Cache Keys</button>
        <ul>
            {cacheKeys.map(x => (<li key={x}>{x}</li>))}
        </ul>
    </>);
}

export default ScsColorDownloader;
