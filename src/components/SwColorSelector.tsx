import { useEffect, useState } from "react";

export interface SwColorSelectorProps {
    colorCode?: string;
    onSelect: (colorCode: string) => void;
}

function SwColorSelector({ onSelect, colorCode }: SwColorSelectorProps) {
    const [colorCodeText, setColorCodeText] = useState<string>('');

    useEffect(() => {
        if (colorCode) setColorCodeText(colorCode);
        else setColorCodeText('');
    }, [colorCode]);

    return (
        <div>
            <input
                type="text"
                placeholder="Enter color code eg SW7602"
                value={colorCodeText}
                onChange={e => setColorCodeText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSelect(colorCodeText)} />
            <button onClick={() => onSelect(colorCodeText)}>Update</button>
        </div>
    );
}

export default SwColorSelector;
