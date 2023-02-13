export function or<T>(
    iterable: Iterable<T>,
    callback: (value: T) => boolean
): boolean {
    for (const item of iterable) {
        if (callback(item)) return true;
    }
    return false;
}
export function and<T>(
    iterable: Iterable<T>,
    callback: (value: T) => boolean
): boolean {
    for (const item of iterable) {
        if (!callback(item)) return false;
    }
    return true;
}
