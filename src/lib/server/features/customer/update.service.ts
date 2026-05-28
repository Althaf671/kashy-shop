import { customers, db } from "$lib/server/data";
import { UpdateCustomerByIdScheme, type TUpdateCustomerByIdRequest, type TUpdateCustomerByIdResponse } from "$lib/types/features";
import { Result, STATUS_CODE } from "$lib/types/global";
import { and, eq, ne } from "drizzle-orm";

const DOMAIN = "UpdateCustomerByIdService" as const

export async function updateCustomerByIdAsync(data: TUpdateCustomerByIdRequest)
    : Promise<Result<TUpdateCustomerByIdResponse>>
{
    const validation = UpdateCustomerByIdScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: customerId, data: patchData } = validation.data

    try {
        if (patchData.phone !== undefined) {
            const [isPhoneExist] = await db
                .select({ id: customers.id })
                .from(customers)
                .where(
                    and(
                        eq(customers.phone, patchData.phone),
                        ne(customers.id, customerId)
                    )
                )
                .limit(1)
            
            if (isPhoneExist) 
                return Result.failure({
                    code: STATUS_CODE.DUPLICATED,
                    description: `Phone number ${patchData.phone} is already exist, use another one.`,
                    domain: DOMAIN
                })
        }

        const [updatedCustomer] = await db
            .update(customers)
            .set({ 
                ...(patchData.name !== undefined && { name: patchData.name }),
                ...(patchData.phone !== undefined && { phone: patchData.phone }),
                ...(patchData.instagramUrl !== undefined && { instagramUrl: patchData.instagramUrl }),
                updatedAt: new Date()
            })
            .where(eq(customers.id, customerId))
            .returning()

        if (!updatedCustomer)
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description:  `Customer with ID: ${customerId} not found.`,
                domain: DOMAIN
            })

        const response: TUpdateCustomerByIdResponse = {
            id: updatedCustomer.id,
            name: updatedCustomer.name
        }

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}