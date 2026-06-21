export function toError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error(String(error));
}

export type ErrorPair<T> = { field: string; ori: T; current: T };

export function findSpecificErrorValues<T>(pairs: ErrorPair<T>[]) {
    return pairs.find(pair => pair.ori === pair.current);
}