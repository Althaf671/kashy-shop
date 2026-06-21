import { statusCodes, type TCreateCategoryRequest, type TCreateProductRequest } from "$lib";
import { getDashboardAggregateDataAsync } from "$lib/server/features/aggregate/dashboard.service";
import { createCategoryAsync } from "$lib/server/features/category";
import { TOAST_TYPE, type IMetricItem, type TCardProps } from "$lib/types/global/ui.types";
import { parseErrorDescription } from "$lib/utils/errorParser";
import { getOptionalFile, getOptionalString } from "$lib/utils/form";
import { getIconForMetric } from "$lib/utils/iconManager";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createProductAsync } from "$lib/server/features/product";

export async function load()
    : Promise<{ metrics: TCardProps[], error?: unknown }> 
{
    //-- metric data and icon
    const metricData = await getDashboardAggregateDataAsync()
    console.log(metricData.error.description)
    if (metricData.isFailure) {
        return {
            metrics: [],
            error: metricData.error.description
        }
    }
    
    const metricProps: TCardProps[] = metricData.value.map((data) => ({
        type: "metric",
        item: { 
            name: data?.allTimeData?.name, 
            value: data?.allTimeData?.totalValue, 
            icon: getIconForMetric(data.allTimeData!.name),
            progress: { 
                value: data?.allTimeData?.progress.value,
                trend: data?.allTimeData?.progress.trend
            }
        } as IMetricItem 
    }))

    //-- chart data

    return { metrics: metricProps }
}

export const actions: Actions = {
    createCategory: async function createCategory(event) {
        const formData = await event.request.formData()

        const data: TCreateCategoryRequest = {
            name: getOptionalString(formData, 'name')!,
            description: getOptionalString(formData, 'description')!,
            thumbnailPicture: getOptionalFile(formData, 'thumbnailPicture')!,
            slug: getOptionalString(formData, 'slug')!,
        }

        const result = await createCategoryAsync(data)
        if (result.isFailure) {
            const { code, description } = result.error;

            if (code === statusCodes.VALIDATION_ERROR) {
                return fail(400, {
                    success: false,
                    errors: parseErrorDescription(description) 
                });
            }

            return fail(400, {
                success: false,
                reactiveToast: {
                    type: TOAST_TYPE.ERROR,
                    message: description 
                }
            });
        }

        return {
            success: true,
            reactiveToast: {
                type: TOAST_TYPE.SUCCESS,
                message: result.value.message
            }
        }
    },
    // patchCategory: async function patchCategory(event) {

    // },
    createProduct: async function createProduct(event) {
        const formData = await event.request.formData()

        const images: Array<File> = []
        let i = 0

        while (true) {
            const entry = formData.get(`productImage_${i}`)
            if (!entry || !(entry instanceof File)) break
            images.push(entry)
            i++
        }

        const data: TCreateProductRequest = {
            name: getOptionalString(formData, 'name')!,
            description: getOptionalString(formData, 'description')!,
            thumbnailPicture: getOptionalFile(formData, 'thumbnailPicture')!,
            slug: getOptionalString(formData, 'slug')!,
            price: Number(formData.get('price')),
            stock: Number(formData.get('stock')),
            type: formData.get('type') as "pre_order" | "ready_stock",
            isActive: formData.get('isActive') === 'on',
            categoryId: formData.get('categoryId') as string,
            images: images
        }

        const result = await createProductAsync(data)
        if (result.isFailure) {
            const { code, description } = result.error;

            if (code === statusCodes.VALIDATION_ERROR) {
                return fail(400, {
                    success: false,
                    errors: parseErrorDescription(description) 
                });
            }

            return fail(400, {
                success: false,
                reactiveToast: {
                    type: TOAST_TYPE.ERROR,
                    message: description 
                }
            });
        }

        return {
            success: true,
            reactiveToast: {
                type: TOAST_TYPE.SUCCESS,
                message: result.value.message
            }
        }
    },
    // patchProduct: async function patchProduct(event) {

    // }
}