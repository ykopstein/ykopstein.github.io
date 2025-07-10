import { type SharedColorServiceColor, type IColorMetadata } from '../src/sherwinWilliams/api/types';
import { calculateMetadata } from '../src/sherwinWilliams/api/sharedColorService';
import fs from 'fs/promises';

const main = async () => {
    const swColors = await readJsonFile<SharedColorServiceColor[]>('./swColors.json');
    const lookup = swColors.map<IColorMetadata>(x => calculateMetadata(x));

    await fs.writeFile('./colorLookup.json', JSON.stringify(lookup), { encoding: 'utf-8' });
};

async function readJsonFile<T>(path: string): Promise<T> {
    const buffer = await fs.readFile(path);
    const asString = buffer.toString();
    return JSON.parse(asString) as T;
};

await main();
