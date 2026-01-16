import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const publicAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!storeDomain || !publicAccessToken) {
    console.warn('Missing Shopify configuration. Please check your .env file.');
}

export const client = createStorefrontApiClient({
    storeDomain: storeDomain || 'mock-store.myshopify.com',
    apiVersion: '2025-01',
    publicAccessToken: publicAccessToken || 'mock-token',
});

export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    images(first: 1) {
      nodes {
        url
        altText
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        price {
          amount
          currencyCode
        }
      }
    }
    # Metafields for Nichema specific data
    ingredients: metafield(namespace: "custom", key: "ingredients") { value }
    usage: metafield(namespace: "custom", key: "usage") { value }
    storage: metafield(namespace: "custom", key: "storage") { value }
    packaging: metafield(namespace: "custom", key: "packaging") { value }
    weight: metafield(namespace: "custom", key: "weight") { value }
    volume: metafield(namespace: "custom", key: "volume") { value }
    badge: metafield(namespace: "custom", key: "badge") { value }
    category: metafield(namespace: "custom", key: "category") { value }
  }
`;
