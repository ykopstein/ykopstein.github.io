import { Button, TextField } from "@mui/material";
import { defineTag, getTags, getTagsOnColor, tagColor } from "../api/colorTagging";
import { useState } from "react";

export interface ColorTagEditorProps {
    colorCode: string;
}

function ColorTagEditor({ colorCode }: ColorTagEditorProps) {
    const tagsOnColor = getTagsOnColor(colorCode);
    const tags = getTags();

    const [newTagName, setNewTagName] = useState('');
    const [newTagValue, setNewTagValue] = useState('');
    const [newTagHex, setNewTagHex] = useState('');
    const [tagValue, setTagValue] = useState('');
    
    const createTagAndTagColor = () => {
        defineTag({
            tag: newTagName,
            value: newTagValue,
            displayColorHex: newTagHex
        });
        tagColor(colorCode, newTagName, newTagValue);
    };

    return (<>
        <ul style={{ listStyle: 'none' }}>
            {tags.map(x => {
                const tagOnColor = tagsOnColor.filter(x => x.tag === x.tag)[0];
                return (<li>
                    <span>{x.tag}</span>
                    <TextField value={tagOnColor?.value} onChange={e => setTagValue(e.target.value)} />
                    <Button onClick={_ => tagColor(colorCode, x.tag, tagValue)}>Set</Button>
                </li>);
            })}

            <li>
                <TextField placeholder="Tag name" onChange={e => setNewTagName(e.target.value)} />
                <TextField placeholder="Tag value" onChange={e => setNewTagValue(e.target.value)} />
                <TextField placeholder="Display color" onChange={e => setNewTagHex(e.target.value)} />
                <Button onClick={createTagAndTagColor}>Add +</Button>
            </li>
        </ul>
    </>);
}

export default ColorTagEditor;
