//--- response wrapper (i bring ts from .NET haha) ---------------------------
export type AppError = {
    readonly code: string;
    readonly description?: string;
    readonly domain?: string;
};
export const ErrorNone: AppError = { code: "" };
export class Result<T> {
    public readonly isSuccess: boolean;
    public readonly error: AppError;
    private readonly _value: T | null;

    protected constructor(isSuccess: boolean, error: AppError, value: T | null = null) {
        if (isSuccess && error !== ErrorNone || !isSuccess && error === ErrorNone) {
            throw new Error("Invalid error state");
        }
        this.isSuccess = isSuccess;
        this.error = error;
        this._value = value;
    }

    public get isFailure(): boolean {
        return !this.isSuccess;
    }

    public get value(): T {
        if (!this.isSuccess) {
            throw new Error("Cannot access value of a failure result.");
        }
        return this._value as T;
    }

    public static success<T>(value: T): Result<T> {
        return new Result(true, ErrorNone, value);
    }

    public static failure<T = null>(error: AppError): Result<T> {
        return new Result<T>(false, error, null);
    }
}

//--- order status -------------------------------
export const ORDER_STATUS = [
    'pending', 'confirmed', 'paid', 'processing', 'done', 'cancelled' 
] as const;

export type TOrderStatus = typeof ORDER_STATUS[number]

//--- product type -------------------------------
export const PRODUCT_TYPE = [
    'pre_order', 'ready_stock'
] as const;

export type TProductType = typeof PRODUCT_TYPE[number]

//--- payment method -----------------------------
export const PAYMENT_METHOD = [
    'qris', 'transfer', 'cash'
] as const;

export type TPaymentMethod = typeof PAYMENT_METHOD[number]