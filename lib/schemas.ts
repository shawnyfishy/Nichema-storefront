import { z } from 'zod';

// Basic Types
export const MoneySchema = z.object({
    amount: z.string(),
    currencyCode: z.string().optional(),
});

export const ImageSchema = z.object({
    url: z.string().url(),
    altText: z.string().nullable().optional(),
});

export const MetafieldSchema = z.object({
    value: z.string().nullable(),
});

// Variant Schema
export const VariantSchema = z.object({
    id: z.string(),
    title: z.string(),
    price: MoneySchema.optional(),
    availableForSale: z.boolean().optional(),
});

// Product Schema
export const ProductSchema = z.object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    description: z.string(),
    priceRange: z.object({
        minVariantPrice: MoneySchema
    }),
    images: z.object({
        nodes: z.array(ImageSchema)
    }),
    // Custom Metafields
    ingredients: MetafieldSchema.nullable().optional(),
    usage: MetafieldSchema.nullable().optional(),
    storage: MetafieldSchema.nullable().optional(),
    packaging: MetafieldSchema.nullable().optional(),
    skinType: MetafieldSchema.nullable().optional(),
    badge: MetafieldSchema.nullable().optional(),
    weight: MetafieldSchema.nullable().optional(), // Added weight
    volume: MetafieldSchema.nullable().optional(), // Added volume
    category: MetafieldSchema.nullable().optional(), // Added category

    variants: z.object({
        nodes: z.array(VariantSchema)
    }).optional()
});

// Cart Schemas
export const CartLineSchema = z.object({
    id: z.string(),
    quantity: z.number(),
    merchandise: z.object({
        id: z.string(),
        title: z.string(),
        product: z.object({
            title: z.string(),
            images: z.object({
                nodes: z.array(ImageSchema)
            })
        })
    })
});

export const CartSchema = z.object({
    id: z.string(),
    checkoutUrl: z.string().url(),
    lines: z.object({
        nodes: z.array(CartLineSchema)
    })
});

export type VerifiedProduct = z.infer<typeof ProductSchema>;
export type VerifiedCart = z.infer<typeof CartSchema>;
