import { smartClient } from './lib/smart-client';
import { PRODUCT_FRAGMENT } from './lib/shopify';
import { Product } from './types';
import { mockProducts } from './lib/mockData';
import { ProductSchema, VerifiedProduct } from './lib/schemas';

// Helper to map Verified (Zod) Product to Local Product Interface
const mapVerifiedProduct = (node: VerifiedProduct): Product => {
  const price = node.priceRange.minVariantPrice.amount;

  // Safe Parse Metafields
  const ingredients = node.ingredients?.value
    ? (node.ingredients.value.includes('[')
      ? JSON.parse(node.ingredients.value)
      : node.ingredients.value.split(',').map(s => s.trim()))
    : [];

  const sizes = node.variants?.nodes?.map(v => ({
    label: v.title === 'Default Title' ? 'One Size' : v.title,
    price: parseFloat(v.price?.amount || price),
    id: v.id
  })) || [];

  return {
    id: node.id,
    name: node.title,
    category: (node.category?.value || 'coming-soon') as any, // Type assertion for API string
    price: parseFloat(price),
    weight: node.weight?.value || undefined,
    volume: node.volume?.value || undefined,
    badge: node.badge?.value || 'New',
    description: node.description,
    ingredients: ingredients,
    usage: node.usage?.value || '',
    storage: node.storage?.value || '',
    packaging: node.packaging?.value || '',
    skinType: node.skinType?.value || 'All Skin Types',
    image: node.images.nodes[0]?.url || '',
    sizes: sizes.length > 0 ? sizes : undefined
  };
};

// --- DATA FETCHING ---

export async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    const query = `
        ${PRODUCT_FRAGMENT}
        query GetProducts($query: String) {
          products(first: 20, query: $query) {
            nodes {
              ...ProductFragment
              skinType: metafield(namespace: "custom", key: "skin_type") { value }
              category: metafield(namespace: "custom", key: "category") { value }
              badge: metafield(namespace: "custom", key: "badge") { value }
              weight: metafield(namespace: "custom", key: "weight") { value }
              volume: metafield(namespace: "custom", key: "volume") { value }
            }
          }
        }
      `;

    const shopifyQuery = category && category !== 'all' ? `tag:${category}` : '';

    // Use Smart Client with Caching (5 mins)
    const { data, errors } = await smartClient.request(query, {
      variables: { query: shopifyQuery },
      cacheTTL: 300000 // 5 minutes
    });

    if (errors) {
      console.warn('Shopify API errors:', errors);
      throw new Error('Shopify API errors');
    }

    const rawNodes = data?.products?.nodes || [];
    const validProducts: Product[] = [];

    for (const node of rawNodes) {
      // Zod Validation - "Defensive Layer"
      const result = ProductSchema.safeParse(node);
      if (result.success) {
        validProducts.push(mapVerifiedProduct(result.data));
      } else {
        console.warn(`[Validation] Dropped invalid product "${node.title}":`, result.error);
      }
    }

    if (validProducts.length === 0) throw new Error("No valid products found");
    return validProducts;

  } catch (error) {
    console.warn("Falling back to mock data:", error);
    if (category && category !== 'all') {
      return mockProducts.filter(p => p.category === category);
    }
    return mockProducts;
  }
}

export async function fetchProduct(identifier: string): Promise<Product> {
  try {
    const isHandle = !identifier.startsWith('gid://');

    const query = isHandle ? `
        ${PRODUCT_FRAGMENT}
        query GetProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
             ...ProductFragment
            skinType: metafield(namespace: "custom", key: "skin_type") { value }
            category: metafield(namespace: "custom", key: "category") { value }
            badge: metafield(namespace: "custom", key: "badge") { value }
            weight: metafield(namespace: "custom", key: "weight") { value }
            volume: metafield(namespace: "custom", key: "volume") { value }
          }
        }
      ` : `
        ${PRODUCT_FRAGMENT}
        query GetProduct($id: ID!) {
          product(id: $id) {
             ...ProductFragment
            skinType: metafield(namespace: "custom", key: "skin_type") { value }
            category: metafield(namespace: "custom", key: "category") { value }
            badge: metafield(namespace: "custom", key: "badge") { value }
            weight: metafield(namespace: "custom", key: "weight") { value }
            volume: metafield(namespace: "custom", key: "volume") { value }
          }
        }
      `;

    const variables = isHandle ? { handle: identifier } : { id: identifier };

    // Cache Single Product for 5 mins
    const { data, errors } = await smartClient.request(query, {
      variables,
      cacheTTL: 300000
    });

    const productNode = isHandle ? data?.productByHandle : data?.product;

    if (errors || !productNode) throw new Error('Failed to fetch product');

    // Validate
    const result = ProductSchema.parse(productNode);
    return mapVerifiedProduct(result);

  } catch (error) {
    console.warn("Falling back to mock data for product:", identifier);
    const product = mockProducts.find(p => p.id === identifier || p.name.toLowerCase().replace(/ /g, '-') === identifier);
    if (!product) throw new Error('Product not found in mock data either');
    return product;
  }
}

// --- SEARCH & DISCOVERY ---

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  if (!searchTerm || searchTerm.length < 2) return [];

  const query = `
      ${PRODUCT_FRAGMENT}
      query SearchProducts($query: String!) {
        products(first: 5, query: $query) {
           nodes {
             ...ProductFragment
            skinType: metafield(namespace: "custom", key: "skin_type") { value }
            category: metafield(namespace: "custom", key: "category") { value }
           }
        }
      }
    `;

  // Construct simplified predictive query
  const shopifyQuery = `title:${searchTerm}* OR product_type:${searchTerm}*`;

  try {
    const { data } = await smartClient.request(query, {
      variables: { query: shopifyQuery },
      cacheTTL: 60000 // Cache search results for 1 min
    });

    const rawNodes = data?.products?.nodes || [];
    // Relaxed validation for search previews (map directly if needed, or validate strict)
    return rawNodes.map((node: any) => {
      const result = ProductSchema.safeParse(node);
      return result.success ? mapVerifiedProduct(result.data) : null;
    }).filter(Boolean) as Product[];

  } catch (e) {
    console.error("Search failed", e);
    return [];
  }
}

// --- SEO HELPER ---

export function generateJsonLd(product: Product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR", // Assuming INR based on stack
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
}


// --- CART FUNCTIONS (No Cache) ---

const CART_ID_KEY = 'nichema_cart_id';
const CHECKOUT_URL_KEY = 'nichema_checkout_url';

async function getOrCreateCart(): Promise<string> {
  let cartId = localStorage.getItem(CART_ID_KEY);
  if (cartId) return cartId;

  const token = localStorage.getItem('shopify_customer_token');
  const buyerIdentity = token ? `buyerIdentity: { customerAccessToken: "${token}" }` : '';

  const createQuery = `
    mutation cartCreate {
      cartCreate(input: { ${buyerIdentity} }) {
        cart { id checkoutUrl }
      }
    }
  `;
  try {
    // 0 TTL -> Never cache cart ops
    const { data } = await smartClient.request(createQuery, { cacheTTL: 0 });
    cartId = data?.cartCreate?.cart?.id;
    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;

    if (cartId) {
      localStorage.setItem(CART_ID_KEY, cartId);
      if (checkoutUrl) localStorage.setItem(CHECKOUT_URL_KEY, checkoutUrl);
      return cartId;
    }
    throw new Error('Failed to create cart');
  } catch (e) {
    console.error("Cart creation failed:", e);
    throw e;
  }
}

export async function associateCartWithUser(accessToken: string) {
  const cartId = localStorage.getItem(CART_ID_KEY);
  if (!cartId) return;

  const query = `
      mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
          cart { id }
          userErrors { message }
        }
      }
    `;

  try {
    await smartClient.request(query, {
      variables: { cartId, buyerIdentity: { customerAccessToken: accessToken } },
      cacheTTL: 0
    });
  } catch (e) { console.error("Failed to sync cart", e); }
}

export async function addToCartApi(productId: string, quantity: number, size?: { label: string; price: number; id?: string }) {
  const cartId = await getOrCreateCart();

  const variantId = size?.id || productId;
  let actualVariantId = size?.id;

  if (!actualVariantId) {
    try {
      const product = await fetchProduct(productId); // This fetch is cached, so it's fast
      if (product.sizes?.[0]?.id) actualVariantId = product.sizes[0].id;
    } catch (e) { console.error("Variant resolution failed", e); }
  }

  if (!actualVariantId) {
    console.warn("Mocking Add to Cart (Invalid Variant ID)");
    return { id: 'mock-cart-id', lines: [] };
  }

  const addLineQuery = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) { nodes { id quantity } }
          checkoutUrl
        }
        userErrors { message }
      }
    }
  `;

  const { data, errors } = await smartClient.request(addLineQuery, {
    variables: { cartId, lines: [{ merchandiseId: actualVariantId, quantity }] },
    cacheTTL: 0 // Never cache mutations
  });

  if (errors || data?.cartLinesAdd?.userErrors?.length > 0) {
    throw new Error(data?.cartLinesAdd?.userErrors?.[0]?.message || 'Failed to add to cart');
  }

  if (data.cartLinesAdd.cart.checkoutUrl) {
    localStorage.setItem(CHECKOUT_URL_KEY, data.cartLinesAdd.cart.checkoutUrl);
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLine(lineId: string, quantity: number) {
  const cartId = await getOrCreateCart();
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 20) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title }
                }
              }
            }
          }
          checkoutUrl
        }
        userErrors { message }
      }
    }
  `;

  const { data, errors } = await smartClient.request(query, {
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cacheTTL: 0
  });

  if (errors || data?.cartLinesUpdate?.userErrors?.length > 0) {
    throw new Error(data?.cartLinesUpdate?.userErrors?.[0]?.message || 'Failed to update cart');
  }

  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(lineId: string) {
  const cartId = await getOrCreateCart();
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 20) {
             nodes { id quantity }
          }
          checkoutUrl
        }
        userErrors { message }
      }
    }
  `;

  const { data, errors } = await smartClient.request(query, {
    variables: { cartId, lineIds: [lineId] },
    cacheTTL: 0
  });

  if (errors || data?.cartLinesRemove?.userErrors?.length > 0) {
    throw new Error(data?.cartLinesRemove?.userErrors?.[0]?.message || 'Failed to remove from cart');
  }

  return data.cartLinesRemove.cart;
}

export async function getCart() {
  const cartId = localStorage.getItem(CART_ID_KEY);
  if (!cartId) return null;

  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 20) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                product {
                  id
                  title
                  handle
                  images(first: 1) { nodes { url } }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await smartClient.request(query, {
    variables: { cartId },
    cacheTTL: 0
  });

  if (data?.cart?.checkoutUrl) {
    localStorage.setItem(CHECKOUT_URL_KEY, data.cart.checkoutUrl);
  }

  return data?.cart;
}
