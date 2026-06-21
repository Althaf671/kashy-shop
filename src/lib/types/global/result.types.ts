import { statusCodes } from "$lib/constants";
import { toError } from "$lib/server/utils/general/error";

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
        if ((isSuccess && error !== ErrorNone) || (!isSuccess && error === ErrorNone)) {
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

    public static failure<T = unknown>(error: AppError): Result<T> {
        return new Result<T>(false, error, null);
    }

    public static validationFailure<T = unknown>(
        zodError: { issues: Array<{ path: Array<unknown | number>; message: string }> }, 
        domain: string
    ): Result<T> {
        const errMessage = zodError.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ')

        return Result.failure<T>({
            code: statusCodes.VALIDATION_ERROR,
            description: errMessage,
            domain
        });
    }

    public static serverError<T = unknown>(error: unknown, domain: string): Result<T> {
        return Result.failure<T>({
            code: statusCodes.SERVER_ERROR,
            description: toError(error).message, 
            domain: domain
        });
    }
}