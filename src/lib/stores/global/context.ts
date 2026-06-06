// global header bridge context
export type THeaderData = {
    pageName: string;
    description: string;
}
const symbol = 'HEADER' as const;
export const HEADER_KEY = Symbol(symbol);