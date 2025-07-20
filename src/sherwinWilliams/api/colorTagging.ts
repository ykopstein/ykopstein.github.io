export interface IColorTag {
    tag: string;
    displayColorHex: string;
}

let _lsTags: IColorTag[] | null = null;
const _lsGetTags = (): IColorTag[] => {
    if (!_lsTags) {
        const stored = localStorage.getItem('ct:tags');
        if (!stored) _lsTags = [];
        else _lsTags = JSON.parse(stored) as IColorTag[];
    }

    return _lsTags;
}

const _lsSetTags = (tags: IColorTag[]) => {
    _lsTags = tags;
    localStorage.setItem('ct:tags', JSON.stringify(tags));
};

interface TagColorJoin {
    tag: string;
    colorCode: string;
}

let _lsTagColorJoins: TagColorJoin[] | null = null;
const _lsGetTagColorJoins = (): TagColorJoin[] => {
    if (!_lsTagColorJoins) {
        const stored = localStorage.getItem('ct:joins');
        if (!stored) _lsTagColorJoins = [];
        else _lsTagColorJoins = JSON.parse(stored) as TagColorJoin[];
    }

    return _lsTagColorJoins;
};

const _lsSetTagColorJoins = (entries: TagColorJoin[]) => {
    _lsTagColorJoins = entries;
    localStorage.setItem('ct:joins', JSON.stringify(entries));
};

export const getTags = (): IColorTag[] => {
    return _lsGetTags();
};

export const defineTag = (tag: IColorTag) => {
    _lsSetTags([..._lsGetTags(), tag]);
};

export const overrideAllTags = (tags: IColorTag[]) => {
    _lsSetTags(tags);
};

export const tagColor = (colorCode: string, tag: string) => {
    const currentJoins = _lsGetTagColorJoins();
    let currentJoinedColor = currentJoins.find(x => x.colorCode === colorCode);
    if (!currentJoinedColor) {
        currentJoinedColor = { colorCode: colorCode, tag: tag };
        currentJoins.push(currentJoinedColor);
    } else {
        currentJoinedColor.tag = tag;
    }

    _lsSetTagColorJoins(currentJoins);
};

export const getTaggedColors = () => {
    return _lsGetTagColorJoins();
};
