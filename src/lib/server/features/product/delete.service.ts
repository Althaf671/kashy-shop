import { messages, statusCodes } from "$lib/constants";
import { db, orderItems, orders, products } from "$lib/server/data";
import { DeleteProductByIdScheme, type TDeleteProductByIdRequest } from "$lib/types/features";
import { Result } from "$lib/types/global";
import { and, eq, notInArray, sql } from "drizzle-orm";

const DOMAIN = "DeleteProductService" as const

//--- delete by id -------------------------------
export async function deleteProductByIdAsync(data: TDeleteProductByIdRequest)
    : Promise<Result<string>> 
{
    const validation = DeleteProductByIdScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: productId } = validation.data

    try {
        const isProductAvailable = await isProductAvailableAsync(productId)
        if (isProductAvailable.isFailure) return Result.failure(isProductAvailable.error)

        const isProductInActive = await isProductInActiveOrdersAsync(productId)
        if (isProductInActive.isFailure) return Result.failure(isProductInActive.error)

        const now = Date.now().toString()
        const [deletedProduct] = await db
            .update(products)
            .set({
                slug: sql`${products.slug} || '-deleted-' || ${now}`,
                isSoftDeleted: true
            })
            .where(eq(products.id, productId))
            .returning({ id: products.id })
        if (!deletedProduct) 
            return Result.failure({
                code: statusCodes.NOT_FOUND,
                description: messages.NOT_FOUND("Product", productId),
                domain: DOMAIN
            })

        return Result.success(`Success deleting product with ID: ${productId}.`)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

//--- helper -------------------------------------
// find is product is exist and non in status active
async function isProductAvailableAsync(productId: string): Promise<Result<boolean>>{
    const [productRecord] = await db
        .select({ isActive: products.isActive })
        .from(products)
        .where(and(
            eq(products.id, productId),
            eq(products.isSoftDeleted, false)
        ))
        .limit(1)

    if (!productRecord) 
        return Result.failure({
            code: statusCodes.NOT_FOUND,
            description: messages.NOT_FOUND("Product", productId),
            domain: DOMAIN
        })

    if (productRecord.isActive)
        return Result.failure({
            code: statusCodes.BAD_REQUEST,
            description: `You can't delete this product while it is still active. Please deactivate it first.`,
            domain: DOMAIN
        })

    return Result.success(true)
}

// find any order item from order that's associate with current product
async function isProductInActiveOrdersAsync(productId: string) 
    : Promise<Result<boolean>>
{
    const [isProductOnActiveOrder] = await db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(and(
            eq(orderItems.productId, productId),
            notInArray(orders.status, ['done', 'cancelled'])
        ))
        .limit(1)

    if (isProductOnActiveOrder)
        return Result.failure({
            code: statusCodes.FORBIDDEN,
            description: `Cannot delete this product because there are active, unconfirmed customer orders associated with it.`,
            domain: DOMAIN
        })

    return Result.success(true)
}