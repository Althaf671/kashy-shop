import { relations } from "drizzle-orm";
import { categories, customers, orderItems, orders, products } from "./schema";

export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products)
}))

export const productRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
    }),
    orderItems: many(orderItems)
}))

export const orderRelations = relations(orders, ({ one, many }) => ({
    customer: one(customers, {
        fields: [orders.customerId],
        references: [customers.id]
    }),
    orderItems: many(orderItems)
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id]
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id]
    })
}))

export const customerRelations = relations(customers, ({ many }) => ({
    orders: many(orders)
}))