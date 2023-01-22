
/**
 * Utility for setting a depth limit on recursive function calls.
 * @param depth 
 * @returns 
 */
export function descend(depth: number): number {
    if (depth <= 0) {
        throw new Error('Depth limit exceeded');
    }
    return depth - 1;
}
