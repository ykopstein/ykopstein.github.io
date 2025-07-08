import { useEffect, useState } from "react";

export interface ScsColorSelectorProps {
    colorCode?: string;
    onSelect: (colorCode: string) => void;
}

function ScsColorSelector({ onSelect, colorCode }: ScsColorSelectorProps) {
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

export default ScsColorSelector;
