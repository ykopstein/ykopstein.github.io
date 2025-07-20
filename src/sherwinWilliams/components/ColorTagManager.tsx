import { useState } from "react";
import { getTags, overrideAllTags } from "../api/colorTagging";
import { TextField, Typography } from "@mui/material";

function ColorTagManager() {
    const [tags, setTags] = useState(getTags());
    const [newTagName, setNewTagName] = useState('');
    const [newHexColor, setNewHexColor] = useState('');

    const saveTagChanges = () => {
        const newTags = [...tags];

        if(newTagName) {
            newTags.push({ tag: newTagName, displayColorHex: newHexColor });
            setNewHexColor('');
            setNewTagName('');
        }
        
        setTags(newTags);
        overrideAllTags(newTags);
    };

    return (<>
        <ul style={{
            listStyle: 'none'
        }}>
            {tags.map((x, ix) => (
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                    <Typography sx={{ marginRight: 2 }}>{x.tag}</Typography>
                    <TextField
                        value={x.displayColorHex}
                        placeholder="Hex color"
                        onChange={e => setTags(prev => { prev[ix].displayColorHex = e.target.value; return prev; })} />
                </li>
            ))}
            <li>
                <TextField sx={{ marginRight: 2 }} placeholder="New tag" value={newTagName} onChange={e => setNewTagName(e.target.value)} />
                <TextField placeholder="Hex color" value={newHexColor} onChange={e => setNewHexColor(e.target.value)} />
            </li>
        </ul>
        <button onClick={saveTagChanges}>Save Changes</button>
    </>);
}

export default ColorTagManager;
