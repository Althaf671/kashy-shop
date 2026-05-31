export function toError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error(String(error));
}

type ValuePair<T> = {
    ori: T;
    current: T; 
};

export function findSpecificErrorValues<T>(
    ...pairs: ValuePair<T>[]
): string {
    const unchangedItems = pairs
        .filter(pair => pair.ori === pair.current)
        .map(pair => `'${pair.current}'`); 

    if (unchangedItems.length === 0) {
        return "No items matched original values";
    }

    if (unchangedItems.length === 1) {
        return `item ${unchangedItems[0]} is`;
    }

    const lastItem = unchangedItems.pop();
    const joinedItems = unchangedItems.join(", ");
    
    return `item ${joinedItems} and item ${lastItem} are`;
}