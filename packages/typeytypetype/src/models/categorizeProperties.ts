import { type Model } from './Model.js';
import { type PropertyModel } from './PropertyModel.js';

function groupBy<T>(
    properties: T[],
    getCategory: (item: T) => string
): Map<string, { category: string; items: T[] }> {
    const map = new Map<string, { category: string; items: T[] }>();

    for (const item of properties) {
        const key = getCategory(item);

        let match = map.get(key);
        if (match === undefined) {
            match = { category: key, items: [] };
            map.set(key, match);
        }

        match.items.push(item);
    }

    return map;
}

export function categorizeProperties(
    model: Model<Record<string, unknown>>
): Array<{ category: string; items: Array<PropertyModel<unknown>> }> {
    const properties = model.unknownGetProperties();

    const map = groupBy(
        properties,
        (item) => item.type.category ?? 'Misc'
    );

    const keys = [...map.keys()];
    keys.sort();
    return keys.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (x) => map.get(x)!
    );
}
