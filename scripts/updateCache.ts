import { type SharedColorServiceColor } from '../src/sherwinWilliams/api/types';
import { downloadColorInfo, toSwCodeString } from '../src/sherwinWilliams/api/sharedColorService';
import fs from 'fs/promises';

const main = async () => {
    if (process.argv.length !== 4) throw new Error('Usage: npm run downloadSwColors <minColor> <maxColor>');
    const minCode = parseInt(process.argv[2]);
    const maxCode = parseInt(process.argv[3]);
    
    const swColors = await readOrInit<SharedColorServiceColor[]>('./swColors.json');
    const invalidCodes = await readOrInit<number[]>('./invalidSwCodes.json');
    
    await downloadColorRange(minCode, maxCode, swColors, invalidCodes, code => code % 100 === 0 ? console.log(`Downloaded up to ${code}`) : undefined);
    await fs.writeFile('./swColors.json', JSON.stringify(swColors, null, 2));
    await fs.writeFile('./invalidSwCodes.json', JSON.stringify(invalidCodes, null, 2));
};

async function readOrInit<T>(path: string): Promise<T> {
    try {
        const buffer = await fs.readFile(path);
        const asString = buffer.toString();
        return JSON.parse(asString) as T;

    } catch {
        return [] as T;
    }
};

const downloadColorRange = async (minCode: number, maxCode: number, swColors: SharedColorServiceColor[], invalidCodes: number[], reporter: (code: number) => void): Promise<void> => {
    for (let code = minCode; code <= maxCode; code++) {
        reporter(code);
        if(swColors.some(c => c.colorNumber === toSwCodeString(code)) || invalidCodes.includes(code)) continue;

        const swCode = toSwCodeString(code);
        const info = await downloadColorInfo(swCode);
        if(info === null) {
            invalidCodes.push(code);
        } else {
            swColors.push(info);
        }
    }
};

await main();
