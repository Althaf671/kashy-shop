import { customers, db, ORDER_CONSTRAINT, orderItems, orders, products } from "$lib/server/data";
import { calculateTotalOrderPrice } from "$lib/server/utils/general/calculator";
import { CreateOrderScheme, type TCreateOrderRequest, type TCreateOrderResponse, type TProductRecord } from "$lib/types/features";
import { MESSAGES, Result, STATUS_CODE } from "$lib/types/global";
import { and, eq, gte, inArray, sql } from "drizzle-orm";

//--- create order -------------------------------
const DOMAIN = "CreateOrderService" as const

export async function createOrderAsync(data: TCreateOrderRequest)
    : Promise<Result<TCreateOrderResponse>>
{
    const validation = CreateOrderScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data

    try {
        const verifyCheckout = await verifyCheckoutRequest(payload)
        if (verifyCheckout.isFailure) return Result.failure(verifyCheckout.error)

        return await db.transaction(async (tx) => {
            const [insertedOrder] = await tx
                .insert(orders)
                .values({
                    customerId: payload.customerId,
                    totalPrice: verifyCheckout.value.totalPrice,
                    paymentMethod: payload.paymentMethod,
                    paymentProof: payload.paymentProof,
                    note: payload.note,
                    status: "pending",
                    createdAt: new Date()
                })
                .returning()

            await tx
                .insert(orderItems)
                .values(
                    payload.items.map(item => ({
                        orderId: insertedOrder.id,
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        priceSnapshot: item.priceSnapshot,
                    }))
                )

            for (const item of payload.items) {
                const result = await tx
                    .update(products)
                    .set({ stock: sql`${products.stock} - ${item.quantity}` })
                    .where(and(
                        eq(products.id, item.productId),
                        gte(products.stock, item.quantity) 
                    ));

                if (result.count === 0) {
                    tx.rollback(); 
                    return Result.failure({
                        code: STATUS_CODE.BAD_REQUEST,
                        description: MESSAGES.BAD_REQUEST("Product", `Insufficient stock for ${item.productId}`),
                        domain: DOMAIN
                    });
                }
            }

            return Result.success({ orderId: insertedOrder.id });
        })

    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

async function verifyCheckoutRequest(payload: TCreateOrderRequest) 
    : Promise<Result<{ totalPrice: number }>>
{
    // customer validation 
    const isCustomerExist = await isCustomerExistAsync(payload.customerId)
    if (isCustomerExist.isFailure) return Result.failure(isCustomerExist.error)

    // get respected product to be compared
    const productRecords = await checkProductsAvailabilityAsync(payload)
    if (productRecords.isFailure) return Result.failure(productRecords.error)

    // order items validation
    const isOrderItemsValid = await validateOrderLineItems(payload, productRecords.value)
    if (isOrderItemsValid.isFailure) return Result.failure(isOrderItemsValid.error)

    // calculate price
    const totalPrice = calculateTotalOrderPrice(payload.items, productRecords.value)
    if (totalPrice.isFailure) return Result.failure(totalPrice.error)

    // order validation
    const validation = await validateBusinessRules(totalPrice.value.totalPrice, productRecords.value.length) 
    if (validation.isFailure) return Result.failure(validation.error)

    return Result.success({ totalPrice: totalPrice.value.totalPrice })
}   

async function isCustomerExistAsync(customerId: string): Promise<Result<boolean>> {
    const [customerRecord] = await db
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1)

    if (!customerRecord)
        return Result.failure({
            code: STATUS_CODE.NOT_FOUND,
            description: MESSAGES.NOT_FOUND("Customer", customerId),
            domain: DOMAIN
        })

    return Result.success(true)
}

async function checkProductsAvailabilityAsync(payload: TCreateOrderRequest)
    : Promise<Result<TProductRecord[]>>
{
    const productIds = payload.items.map(item => item.productId)
    const productRecord = await db
        .select({ 
            id: products.id,
            name: products.name,
            stock: products.stock,
            price: products.price,
        })
        .from(products)
        .where(inArray(products.id, productIds))

    if (productRecord.length !== productIds.length) {
        return Result.failure({
            code: STATUS_CODE.NOT_FOUND,
            description: MESSAGES.NOT_FOUND("Some Products"),
            domain: DOMAIN
        })
    }

    return Result.success(productRecord)
}

async function validateOrderLineItems(payload: TCreateOrderRequest, productRecords: TProductRecord[])
    : Promise<Result<boolean>> 
{
    for (const orderItem of payload.items) {
        const product = productRecords.find(p => p.id === orderItem.productId)

        if (!product)
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: MESSAGES.NOT_FOUND("Product", orderItem.productId),
                domain: DOMAIN
            })
        
        if (product.name !== orderItem.productName)
            return Result.failure({
                code: STATUS_CODE.BAD_REQUEST,
                description: MESSAGES.BAD_REQUEST("product", "name"),
                domain: DOMAIN
            })

        if (product.stock < orderItem.quantity)
            return Result.failure({
                code: STATUS_CODE.BAD_REQUEST,
                description: MESSAGES.BAD_REQUEST("Order", { 
                    current: "quantity", 
                    comparison: "higher",
                    limit: "product stock" 
                }),
                domain: DOMAIN
            })

        if (product.price !== orderItem.priceSnapshot)
            return Result.failure({
                code: STATUS_CODE.BAD_REQUEST,
                description: MESSAGES.BAD_REQUEST("product", "price"),
                domain: DOMAIN
            })
    }

    return Result.success(true)
}

async function validateBusinessRules(totalPrice: number, itemsLength: number)
    : Promise<Result<boolean>>
{
    if (totalPrice > ORDER_CONSTRAINT.totalPriceRange.max)
        return Result.failure({
            code: STATUS_CODE.BAD_REQUEST,
            description: MESSAGES.BAD_REQUEST("Order", {
                current: "input total price",
                comparison: "higher",
                limit: "maximum total price limit."
            }),
            domain: DOMAIN
        })

    if (totalPrice < ORDER_CONSTRAINT.totalPriceRange.min)
        return Result.failure({
            code: STATUS_CODE.BAD_REQUEST,
            description: MESSAGES.BAD_REQUEST("Order", {
                current: "input total price",
                comparison: "lower",
                limit: "minimum total price limit."
            }),
            domain: DOMAIN
        })

    if (itemsLength > 1000)
        return Result.failure({
            code: STATUS_CODE.BAD_REQUEST,
            description: MESSAGES.BAD_REQUEST("Order", {
                current: "items",
                comparison: "higher",
                limit: "1000 items."
            })
        })

    return Result.success(true)
}