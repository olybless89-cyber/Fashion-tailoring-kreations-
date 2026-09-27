import { relations } from "drizzle-orm";
import {
  boolean, customType, index, integer, jsonb, pgEnum, pgTable, text, timestamp,
} from "drizzle-orm/pg-core";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const bytea = customType<{ data: Buffer }>({ dataType: () => "bytea" });

export const orderStatus = pgEnum("order_status", [
  "PENDING_PAYMENT", "CONFIRMED", "IN_PRODUCTION", "READY", "SHIPPED", "DELIVERED", "CANCELLED",
]);
export const paymentStatus = pgEnum("payment_status", ["UNPAID", "PAID", "REFUNDED", "FAILED"]);
export const paymentMethod = pgEnum("payment_method", ["PAYSTACK", "BANK_TRANSFER"]);
export const deliveryMethod = pgEnum("delivery_method", ["DELIVERY", "PICKUP"]);
export const fit = pgEnum("fit", ["STANDARD", "BESPOKE"]);

export const categories = pgTable("categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  images: text("images").array().notNull().default([]),
  fabric: text("fabric"),
  colors: text("colors").array().notNull().default([]),
  sizes: text("sizes").array().notNull().default([]),
  bespoke: boolean("bespoke").notNull().default(true),
  leadTimeDays: integer("lead_time_days").notNull().default(7),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  categoryId: text("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [index("products_category_idx").on(t.categoryId)]);

export type Measurements = Record<string, string>;

export const orders = pgTable("orders", {
  id: id(),
  number: text("number").notNull().unique(),
  accessToken: text("access_token").notNull(),
  status: orderStatus("status").notNull().default("PENDING_PAYMENT"),
  paymentStatus: paymentStatus("payment_status").notNull().default("UNPAID"),
  paymentMethod: paymentMethod("payment_method").notNull(),
  paymentRef: text("payment_ref").unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  deliveryMethod: deliveryMethod("delivery_method").notNull().default("DELIVERY"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  notes: text("notes"),
  measurements: jsonb("measurements").$type<Measurements>(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [index("orders_email_idx").on(t.email), index("orders_status_idx").on(t.status)]);

export const orderItems = pgTable("order_items", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  image: text("image"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  fit: fit("fit").notNull().default("STANDARD"),
  size: text("size"),
  color: text("color"),
}, (t) => [index("order_items_order_idx").on(t.orderId)]);

export const orderEvents = pgTable("order_events", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  status: orderStatus("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("order_events_order_idx").on(t.orderId)]);

export const media = pgTable("media", {
  id: id(),
  mime: text("mime").notNull(),
  data: bytea("data").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({ products: many(products) }));
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}));
export const ordersRelations = relations(orders, ({ many }) => ({ items: many(orderItems), events: many(orderEvents) }));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));
export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, { fields: [orderEvents.orderId], references: [orders.id] }),
}));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderStatus = (typeof orderStatus.enumValues)[number];
