export async function mapAsync<T, U>(
    list: readonly T[],
    callback: (item: T, index: number) => Promise<U> | U
): Promise<U[]> {
    const res: U[] = [];
    for (let i = 0; i < list.length; ++i) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        res.push(await callback(list[i]!, i));
    }
    return res;
}
