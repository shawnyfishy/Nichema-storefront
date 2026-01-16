import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Lazy Initialization to prevent crashes if env vars are missing
let baseClient: any = null;

const getClient = () => {
    if (baseClient) return baseClient;

    try {
        const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
        const accessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

        // If no domain, use a safe string that won't crash the constructor immediately, 
        // or just throw friendly error when used.
        const safeDomain = domain && domain.includes('.') ? domain : 'mock.myshopify.com';

        baseClient = createStorefrontApiClient({
            storeDomain: safeDomain,
            publicAccessToken: accessToken || 'mock_token',
            apiVersion: '2024-01',
        });
        return baseClient;
    } catch (e) {
        console.error("Failed to initialize Shopify Client:", e);
        return null;
    }
};

// Cache Implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface RequestOptions {
    variables?: Record<string, any>;
    cacheTTL?: number; // milliseconds, 0 to disable
    retries?: number;
}

// Friendly Error Map
const ERROR_MAP: Record<string, string> = {
    "Throttled": "We are experiencing high traffic. Please wait a moment.",
    "Internal Server Error": "Something went wrong on our end. We are fixing it.",
    "Network request failed": "Please check your internet connection.",
};

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const smartClient = {
    request: async <T = any>(query: string, options: RequestOptions = {}): Promise<{ data: T | null; errors?: any[] }> => {
        const { variables = {}, cacheTTL = DEFAULT_TTL, retries = 3 } = options;
        const cacheKey = JSON.stringify({ query, variables });

        // 1. Check Cache
        if (cacheTTL > 0) {
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < cacheTTL) {
                console.log(`[SmartCache] Hit: ${query.slice(0, 20)}...`);
                return { data: cached.data };
            }
        }

        // 2. Fetch with Retries
        let attempt = 0;
        while (attempt <= retries) {
            try {
                const client = getClient();
                if (!client) throw new Error("Shopify Client could not be initialized (Check .env)");

                const response = await client.request(query, { variables });

                // 3. Cache Successful Response
                if (response.data && !response.errors && cacheTTL > 0) {
                    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
                }

                return response; // Return standard shape { data, errors }

            } catch (error: any) {
                attempt++;
                const msg = error.message || '';

                // Rate Limit Handling
                if (msg.includes('Throttled') || msg.includes('Too Many Requests') || error.status === 429) {
                    const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
                    console.warn(`[SmartClient] Throttled. Retrying in ${delay}ms...`);
                    await wait(delay);
                    continue;
                }

                // Fatal Error or Max Retries reached
                if (attempt > retries) {
                    console.error("[SmartClient] Request Failed:", error);
                    // Return generic error structure if it crashed completely
                    return { data: null, errors: [{ message: ERROR_MAP[msg] || msg || "Unknown Error" }] };
                }
            }
        }
        return { data: null, errors: [{ message: "Max retries exceeded" }] };
    }
};
