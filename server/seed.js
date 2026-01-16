const { openDb, initDb } = require('./db');

const products = [
    {
        id: 'hair-elixir',
        name: 'Nichema Hair Elixir',
        category: 'haircare',
        price: 800,
        volume: '100 ml',
        badge: 'Natural • Organic • Reusable Glass Bottle',
        sizes: [
            { label: '50 ml', price: 450 },
            { label: '100 ml', price: 800 }
        ],
        description: 'A carefully crafted, preservative-free blend of 26+ natural oils and botanicals, designed to deeply nourish the scalp and hair without heaviness. This deeply nourishing hair oil strengthens roots, reduces breakage, and restores natural shine, transforming hair care into a mindful ritual.',
        ingredients: [
            'Sesame Oil', 'Virgin Olive Oil', 'Mustard Oil', 'Grapeseed Oil', 'Almond Oil',
            'Jojoba Oil', 'Rosehip Oil', 'Black Seed Oil', 'Neem Oil', 'Flaxseed Oil',
            'Vitamin E', 'Amla Oil', 'Bhringaraj Oil', 'Brahmi Oil', 'Arnica Oil',
            'Ginseng Oil', 'Shikakai Oil', 'Rosemary Oil', 'Lavender Oil', 'Myrrh',
            'Blue Pea Pods', 'Lavender Pods', 'Rose Petals', 'Curry Leaves',
            'Rosemary Leaves', 'Vitaliser Concentrate'
        ],
        usage: 'Warm a small amount and massage into the scalp. Leave on for a few hours or overnight before washing. A little goes a long way.',
        storage: 'Store at room temperature. Use within 6 months of purchase. Store away from direct sunlight.',
        packaging: 'Premium glass bottle—designed for reuse. I treat my hair with love and patience.',
        image: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'shatapata-butter',
        name: 'Shatapata Face & Body Butter',
        category: 'skincare',
        price: 550,
        weight: '70g',
        badge: 'Natural • Organic • Reusable Glass Jar',
        description: 'A luxurious blend of traditional wisdom and modern purity, designed to melt into your skin and lock in moisture for 24 hours or more.',
        ingredients: ['Ghee', 'Saffron', 'Almond Oil', 'Rose Water'],
        usage: 'Apply a pea-sized amount to damp skin and massage gently. Best paired with Botanical Toner.',
        storage: 'Store in a cool, dry place. Best kept refrigerated due to zero preservatives.',
        packaging: 'Comes in a reusable glass jar. After use, repurpose for storage or return for refills.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'botanical-toner',
        name: 'Nichema Botanical Toner',
        category: 'skincare',
        price: 200,
        volume: '130 ml',
        badge: 'Natural • Organic • Reusable Spray Bottle',
        description: 'Refreshing mist of active botanicals to balance and hydrate. When sprayed as a gentle mist and patted in, results are simply magical.',
        ingredients: ['Rose Hydrosol', 'Witch Hazel', 'Lavender Extract'],
        usage: 'Mist over face and neck after cleansing and pat in gently.',
        storage: 'Refrigerate for a refreshing, cooling effect and to maintain peak potency.',
        packaging: 'Comes in a reusable glass spray bottle perfect for DIY toners or room sprays.',
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'body-scrubs',
        name: 'Nichema Body Scrubs',
        category: 'skincare',
        price: 450,
        weight: '100g',
        badge: 'Natural • Organic • Reusable Container',
        description: 'Gentle enough to exfoliate without irritation, yet hydrating enough to leave skin feeling fresh and even-toned.',
        ingredients: ['Sugar Cane', 'Honey', 'Lemon Zest', 'Coconut Oil'],
        usage: 'Massage onto damp skin in circular motions. Rinse with lukewarm water.',
        storage: 'Keep in a cool place. Avoid letting water sit inside the jar.',
        packaging: 'Reusable jar—perfect for organizing small items or DIY beauty blends.',
        image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'candle-collection',
        name: 'Nichema Candle Collection',
        category: 'coming-soon',
        price: 0, // TBD handled in frontend? Schema expects REAL. Using 0 or mock price.
        badge: 'Coming Soon',
        description: 'Handcrafted candles to illuminate your space. Sustainable soy wax poured into reusable glass containers.',
        ingredients: ['Soy Wax', 'Natural Essential Oils', 'Cotton Wick'],
        usage: 'Trim wick to 1/4 inch before lighting. Allow wax to melt to the edges on first burn.',
        storage: 'Store in a cool, dry place away from direct sunlight to preserve scent.',
        packaging: 'Reusable glass container—perfect for spice storage or mini planters after use.',
        image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'pottery-collection',
        name: 'Nichema Pottery Collection',
        category: 'coming-soon',
        price: 0,
        badge: 'Coming Soon',
        description: 'Artisan pottery for mindful living. Eco-friendly, timeless pieces to complement your space.',
        ingredients: ['Natural Clay', 'Eco-friendly Glaze'],
        usage: 'Mindfully crafted for everyday rituals.',
        storage: 'Handle with care.',
        packaging: 'Sustainable artisan packaging.',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800'
    }
];

async function seed() {
    const db = await initDb();

    // Clear existing
    await db.exec('DELETE FROM products');

    for (const product of products) {
        await db.run(
            `INSERT INTO products (id, name, category, price, weight, volume, badge, description, ingredients, usage, storage, packaging, image, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product.id,
                product.name,
                product.category,
                product.price === 'TBD' ? 0 : product.price,
                product.weight || null,
                product.volume || null,
                product.badge,
                product.description,
                JSON.stringify(product.ingredients),
                product.usage,
                product.storage,
                product.packaging,
                product.image,
                product.sizes ? JSON.stringify(product.sizes) : null
            ]
        );
    }
    console.log('Seeding complete.');
}

seed().catch(console.error);
