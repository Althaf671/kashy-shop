import { statusCodes, type TCreateCategoryRequest } from "$lib";
import { getDashboardAggregateDataAsync } from "$lib/server/features/aggregate/dashboard.service";
import { createCategoryAsync } from "$lib/server/features/category";
import { TOAST_TYPE, type IMetricItem, type TCardProps } from "$lib/types/global/ui.types";
import { parseErrorDescription } from "$lib/utils/errorParser";
import { getOptionalFile, getOptionalString } from "$lib/utils/form";
import { getIconForMetric } from "$lib/utils/iconManager";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

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
    }
    // patchCategory: async function patchCategory(event) {

    // },
    // createProduct: async function createProduct(event) {

    // },
    // patchProduct: async function patchProduct(event) {

    // }
}