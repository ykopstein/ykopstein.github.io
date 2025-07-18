
export interface IColorTag {
    tag: string;
    value: string;
}

export interface IColorTagMetadata {
    tag: string;
    value: string;
    displayColorHex: string;
}

let _lsTags: IColorTagMetadata[] | null = null;
const _lsGetTags = (): IColorTagMetadata[] => {
    if (!_lsTags) {
        const stored = localStorage.getItem('ct:tags');
        if (!stored) _lsTags = [];
        else _lsTags = JSON.parse(stored) as IColorTagMetadata[];
    }

    return _lsTags;
}

const _lsSetTags = (tags: IColorTagMetadata[]) => {
    _lsTags = tags;
    localStorage.setItem('ct:tags', JSON.stringify(tags));
};

interface TagColorJoin {
    colorCode: string;
    tags: IColorTag[];
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

export const getTags = (): IColorTagMetadata[] => {
    return _lsGetTags();
};

export const defineTag = (tag: IColorTagMetadata) => {
    _lsSetTags([..._lsGetTags(), tag]);
};

export const getTagsOnColor = (colorCode: string): IColorTag[] => {
    return _lsGetTagColorJoins()
        .filter(x => x.colorCode == colorCode)
        .flatMap(x => x.tags);
};

export const tagColor = (colorCode: string, tag: string, value: string) => {
    const currentJoins = _lsGetTagColorJoins();
    let currentJoinedColor = currentJoins.find(x => x.colorCode === colorCode);
    if (!currentJoinedColor) {
        currentJoinedColor = { colorCode: colorCode, tags: [] };
        currentJoins.push(currentJoinedColor);
    }

    let currentTag = currentJoinedColor.tags.find(x => x.tag === tag);
    if(!currentTag) {
        currentJoinedColor.tags.push({ tag: tag, value: value });
    } else {
        currentTag.value = value;
    }

    _lsSetTagColorJoins(currentJoins);
};

export const getTaggedColors = (tag: string): { colorCode: string, tagValue: string }[] => {
    return _lsGetTagColorJoins()
        .filter(x => x.tags.some(y => y.tag === tag))
        .map(x => ({
            colorCode: x.colorCode,
            tagValue: x.tags.find(y => y.tag === tag)!.value
        }));
};
