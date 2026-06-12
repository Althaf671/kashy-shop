import { ORDER_STATUS, PAYMENT_METHOD, PRODUCT_TYPE, type TCloudinaryFile } from "$lib/types/global/shared.types";
import { 
    boolean, 
    check, 
    integer, 
    jsonb, 
    pgEnum, 
    pgTable, 
    primaryKey, 
    timestamp, 
    uuid, 
    varchar } from "drizzle-orm/pg-core";
import { 
    CATEGORIES_CONSTRAINT, 
    CUSTOMERS_CONSTRAINT, 
    ORDER_CONSTRAINT, 
    ORDERITEMS_CONSTRAINT, 
    PRODUCTS_CONSTRAINT, 
    USERS_CONSTRAINT, 
} from "./schema.constraints";
import { sql } from "drizzle-orm";

// enums
export const orderStatusEnum = pgEnum('order_status', ORDER_STATUS)

export const productTypeEnum = pgEnum('product_type', PRODUCT_TYPE)

export const paymentMethodEnum = pgEnum('payment_method', PAYMENT_METHOD)

// shop tables
export const categories = pgTable('categories', {
    id:                 uuid('id').primaryKey().defaultRandom(),
    name:               varchar('name', { length: CATEGORIES_CONSTRAINT.nameLength }).notNull().unique(),
    description:        varchar('description', { length: CATEGORIES_CONSTRAINT.descriptionLength }).notNull(),
    thumbnailPicture:   jsonb('thumbnail_picture').$type<TCloudinaryFile>().notNull(),
    isSoftDeleted:      boolean('is_soft_deleted').default(CATEGORIES_CONSTRAINT.isSoftDeleted),
    slug:               varchar('slug', { length: CATEGORIES_CONSTRAINT.slugLength }).notNull().unique(),
    updatedAt:          timestamp('updated_at', { withTimezone: CATEGORIES_CONSTRAINT.isTimeZone }).defaultNow(),
    createdAt:          timestamp('created_at', { withTimezone: CATEGORIES_CONSTRAINT.isTimeZone }).defaultNow()
}, (table) => [
    {
        singleObjectCheck: check(
            'single_object_check',
            sql`(jsonb_typeof(${table.thumbnailPicture}) = 'object' 
                AND jsonb_typeof(${table.thumbnailPicture}) != 'array')`,
        )
    }
])

export const products = pgTable('products', {
    id:                 uuid('id').primaryKey().defaultRandom(),
    name:               varchar('name', { length: PRODUCTS_CONSTRAINT.nameLength }).notNull(),
    description:        varchar('description', { length: PRODUCTS_CONSTRAINT.descriptionLength }).notNull(),
    thumbnailPicture:   jsonb('thumbnail_picture').$type<TCloudinaryFile>().notNull(),
    slug:               varchar('slug', { length: PRODUCTS_CONSTRAINT.slugLength }).notNull().unique(),
    price:              integer('price').notNull(),
    stock:              integer('stock').notNull(),
    type:               productTypeEnum('type').notNull().default(PRODUCT_TYPE[0]),
    images:             jsonb('image_urls').$type<TCloudinaryFile[]>().notNull(),
    isSoftDeleted:      boolean('is_soft_deleted').default(PRODUCTS_CONSTRAINT.isSoftDeleted),
    isActive:           boolean('is_active').default(PRODUCTS_CONSTRAINT.isActive).notNull(),
    updatedAt:          timestamp('updated_at', { withTimezone: PRODUCTS_CONSTRAINT.isTimeZone }).defaultNow(),
    createdAt:          timestamp('created_at', { withTimezone: PRODUCTS_CONSTRAINT.isTimeZone }).defaultNow(),
    categoryId:         uuid('category_id').references(() => categories.id, { onDelete: 'no action' }).notNull()
}, (table) => ([
    {
        priceCheck: check(
            'price_check', 
            sql`${table.price} >= ${PRODUCTS_CONSTRAINT.priceRange.min} 
                AND ${table.price} <= ${PRODUCTS_CONSTRAINT.priceRange.max}`
        ),
        stockCheck: check(
            'stock_check', 
            sql`${table.stock} >= ${PRODUCTS_CONSTRAINT.stockRange.min} 
                AND ${table.stock} <= ${PRODUCTS_CONSTRAINT.stockRange.max}`
        ),
        singleImageCheck: check(
            'single_image_check',
            sql`(jsonb_typeof(${table.thumbnailPicture}) = 'object' 
                AND jsonb_typeof(${table.thumbnailPicture}) != 'array')`,
        ),
        maxImageCheck: check(
            'max_image_check',
            sql`jsonb_array_length(${table.images}) <= ${PRODUCTS_CONSTRAINT.imageInputLimit}`
        )
    }
]))

export const orders = pgTable('orders', {
    id:                 uuid('id').primaryKey().defaultRandom(),
    orderCode:          varchar('order_code', { length: ORDER_CONSTRAINT.orderCodeLength }).notNull().unique(),
    status:             orderStatusEnum('status').notNull().default(ORDER_STATUS[0]),
    totalPrice:         integer('total_price').notNull(),
    paymentMethod:      paymentMethodEnum('payment_method').default(PAYMENT_METHOD[2]),
    paymentProof:       jsonb('payment_proof').$type<TCloudinaryFile>(),
    note:               varchar('note', { length: ORDER_CONSTRAINT.noteLength }),
    adminNote:          varchar('admin_note', { length: ORDER_CONSTRAINT.adminNoteLength }),
    updatedAt:          timestamp('updated_at', { withTimezone: ORDER_CONSTRAINT.isTimeZone }).defaultNow(),
    createdAt:          timestamp('created_at', { withTimezone: ORDER_CONSTRAINT.isTimeZone }).defaultNow(),
    customerId:         uuid('customer_id').references(() => customers.id, { onDelete: 'restrict'})
}, (table) => ([
    {
        totalPriceCheck: check(
            'total_price_check',
            sql`${table.totalPrice} >= ${ORDER_CONSTRAINT.totalPriceRange.min} 
                AND ${table.totalPrice} <= ${ORDER_CONSTRAINT.totalPriceRange.max}`
        ),
        singleObjectCheck: check(
            'single_object_check',
            sql`(jsonb_typeof(${table.paymentProof}) = 'object' 
                AND jsonb_typeof(${table.paymentProof}) != 'array')`,
        )
    }
]))

export const orderItems = pgTable('order_items', {
    id:                 uuid('id').primaryKey().defaultRandom(),
    productName:        varchar('product_name', { length: ORDERITEMS_CONSTRAINT.productNameLength }).notNull(),
    quantity:           integer('quantity').notNull(),
    priceSnapshot:      integer('price_snapshot').notNull(),
    productId:          uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
    orderId:            uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull()
}, (table) => ([
    {
        priceSnapshotCheck: check(
            'price_snapshot_check',
            sql`${table.priceSnapshot} >= ${ORDERITEMS_CONSTRAINT.priceSnapShot.min} 
                AND ${table.priceSnapshot} <= ${ORDERITEMS_CONSTRAINT.priceSnapShot.max}`
        ),
        orderQuantityCheck: check(
            'order_quantity_check',
            sql`${table.quantity} >= ${ORDERITEMS_CONSTRAINT.quantityRange.min } 
                AND ${table.quantity} <= ${ORDERITEMS_CONSTRAINT.quantityRange.max}`
        )
    }
]))


// user tables
export const users = pgTable('users', {
    id:                 uuid('id').primaryKey().defaultRandom(),
    email:              varchar('email', { length: USERS_CONSTRAINT.nameLength }).notNull().unique(),
    name:               varchar('name',  { length: USERS_CONSTRAINT.nameLength }).notNull(),
    phone:              varchar('phone_number', { length: USERS_CONSTRAINT.phoneLength }).notNull().unique(),
    avatarPicture:      jsonb('avatar_picture').$type<TCloudinaryFile>().notNull(),
    // bio
    // bday
    // quote
    // banner
    updatedAt:          timestamp('updated_at', { withTimezone: USERS_CONSTRAINT.isTimeZone }).defaultNow(),
    createdAt:          timestamp('created_at', { withTimezone: USERS_CONSTRAINT.isTimeZone }).defaultNow()
}, (table) => ([
    {
        singleObjectCheck: check(
            'single_object_check',
            sql`(jsonb_typeof(${table.avatarPicture}) = 'object' 
                AND jsonb_typeof(${table.avatarPicture}) != 'array')`,
        )
    }
]))

export const accounts = pgTable('account', {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    provider: varchar('provider').notNull(), 
    providerAccountId: varchar('provider_account_id').notNull(),
    // unavailable until i need to integrate Google APIs
    // type: varchar('type').notNull(), 
    // refresh_token: varchar('refresh_token'),
    // access_token: varchar('access_token'),
    // expires_at: integer('expires_at'),
    // token_type: varchar('token_type'),
    // scope: varchar('scope'),
    // id_token: varchar('id_token'),
    // session_state: varchar('session_state'),
}, (table) => ([
    {
        pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    }
]))

export const sessions = pgTable('session', {
    sessionToken: varchar('session_token').primaryKey(), 
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiredAt: timestamp('expired_at', { withTimezone: USERS_CONSTRAINT.isTimeZone }).notNull(), 
    // device
    // userAgent
    // ipAddress
});

export const customers = pgTable('customers', {
    id:                 uuid('id').primaryKey().defaultRandom(),
    name:               varchar('name', { length: CUSTOMERS_CONSTRAINT.nameLength }).notNull(),
    phone:              varchar('phone_number', { length: CUSTOMERS_CONSTRAINT.phoneLength }).notNull().unique(),
    instagramUrl:       varchar('instagram_url', { length: CUSTOMERS_CONSTRAINT.instagramUrl }),
    isSoftDeleted:      boolean('is_soft_deleted').default(CUSTOMERS_CONSTRAINT.isSoftDeleted),
    updatedAt:          timestamp('updated_at', { withTimezone: CUSTOMERS_CONSTRAINT.isTimeZone }).defaultNow(),
    createdAt:          timestamp('created_at', { withTimezone: CUSTOMERS_CONSTRAINT.isTimeZone }).defaultNow()
})