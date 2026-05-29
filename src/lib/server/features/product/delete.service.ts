import { db, orderItems, orders, products } from "$lib/server/data";
import { DeleteProductByIdScheme, type TDeleteProductByIdRequest } from "$lib/types/features";
import { Result, STATUS_CODE } from "$lib/types/global";
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
        const [isProductActive] = await db
            .select({ isActive: products.isActive })
            .from(products)
            .where(and(
                eq(products.id, productId),
                eq(products.isSoftDeleted, false)
            ))
            .limit(1)

        if (isProductActive && isProductActive.isActive) 
            return Result.failure({
                code: STATUS_CODE.BAD_REQUEST,
                description: `You can't delete this product while it is still active. Please deactivate it first.`,
                domain: DOMAIN
            })

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
                code: STATUS_CODE.FORBIDDEN,
                description: `Cannot delete this product because there are active, unconfirmed customer orders associated with it.`,
                domain: DOMAIN
            })

        const now = Date.now().toString()

        const [deletedProduct] = await db
            .update(products)
            .set({
                slug: sql`${products.slug} || '-deleted' || ${now}`,
                isSoftDeleted: true
            })
            .where(and(
                eq(products.id, productId),
                eq(products.isSoftDeleted, false)
            ))
            .returning({ id: products.id })

        if (!deletedProduct) 
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Product with ID: ${productId} not found.`,
                domain: DOMAIN
            })

        return Result.success(`Success deleting product with ID: ${productId}.`)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}