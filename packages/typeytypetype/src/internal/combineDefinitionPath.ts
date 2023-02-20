export function combineDefinitionPath(
    path: string | undefined,
    toAdd: number | string
): string {
    if (typeof toAdd === 'number') {
        return (path ?? '') + `[${toAdd}]`;
    } else {
        if (path === undefined) {
            return toAdd;
        }
        return path + '.' + toAdd;
    }
}
