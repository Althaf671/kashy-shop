import type { TCreateOrderItemsRequest, TProductRecord } from "$lib/types/features";
import { Result, STATUS_CODE } from "$lib/types/global";

export function calculateTotalOrderPrice(
    items: TCreateOrderItemsRequest[], 
    products: TProductRecord[]
): Result<{ totalPrice: number }> {
    let total = 0;

    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue; 

        const calcResult = calculatePrice(item.quantity, product.price);

        if (calcResult.isFailure) return Result.failure(calcResult.error);

        total += calcResult.value.price;
    }

    return Result.success({ totalPrice: total });
}

export function calculatePrice(quantity: number, price: number): Result<{ price: number }> {
    if (quantity < 0) {
        return Result.failure({
            code: STATUS_CODE.BAD_REQUEST,
            description: "Quantity cannot be negative",
            domain: "CALCULATOR"
        });
    }

    return Result.success({ price: quantity * price });
}