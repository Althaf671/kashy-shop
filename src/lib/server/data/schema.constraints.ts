export const CATEGORIES_CONSTRAINT = {
    nameLength: 100,
    descriptionLength: 500,
    thumbnailUrlLength: 2048,
    slugLength: 50,
    isTimeZone: true
} as const;

export const PRODUCTS_CONSTRAINT = {
    nameLength: 100,
    descriptionLength: 500,
    thumbnailUrlLength: 2048,
    imageInputLimit: 5,
    slugLength: 50,
    priceRange: {
        min: 1000,
        max: 1000000
    },
    stockRange: {
        min: 0,
        max: 100
    },
    isActive: true,
    isTimeZone: true
} as const;

export const ORDER_CONSTRAINT = {
    orderCodeLength: 100,
    totalPriceRange: {
        min: 1000,
        max: 10000000
    },
    noteLength: 500,
    paymentProofUrlLength: 2048,
    adminNoteLength: 500,
    isTimeZone: true
} as const;

export const ORDERITEMS_CONSTRAINT = {
    productNameLength: 100,
    quantityRange: {
        min: 1,
        max: 100
    },
    priceSnapShot: {
        min: 1000,
        max: 1000000
    }
} as const;

export const USERS_CONSTRAINT = {
    emailLength: 255,
    nameLength: 100,
    phoneLength: 30,
    avatarUrlLength: 2048,
    isTimeZone: true
} as const;


export const CUSTOMERS_CONSTRAINT = {
    nameLength: 100,
    phoneLength: 30,
    instagramUrl: 2048,
    isTimeZone: true
} as const;