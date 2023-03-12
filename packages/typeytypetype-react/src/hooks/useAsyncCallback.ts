import { useCallback, type DependencyList } from 'react';
import useStateRef from 'react-usestateref';

export interface AsyncCallbackOptions {
    signal?: AbortSignal;
}
export interface AsyncCallbackInput {
    signal: AbortSignal;
}

export function useAsyncCallback<TArgs extends unknown[], TResult>(
    func: (input: AsyncCallbackInput, ...args: TArgs) => Promise<TResult>,
    dependencies: DependencyList
): [
    callback: (
        options: AsyncCallbackOptions,
        ...args: TArgs
    ) => Promise<TResult>,
    isRunning: boolean,
    abort: AbortController | null
] {
    const [currentState, setCurrent, currentRef] =
        useStateRef<AbortController | null>(null);

    const callback = useCallback(
        async (
            { signal }: AsyncCallbackOptions,
            ...args: TArgs
        ): Promise<TResult> => {
            const abort = new AbortController();

            if (signal !== undefined) {
                signal.addEventListener('abort', () => {
                    abort.abort();
                });
            }

            if (currentRef.current?.abort !== undefined) {
                currentRef.current.abort();
            }

            const result = await func({ signal: abort.signal }, ...args);

            setCurrent(abort);

            return result;
        },
        // eslint-disable-next-line @grncdr/react-hooks/exhaustive-deps
        dependencies
    );

    return [callback, currentState != null, currentState];
}
