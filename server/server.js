const express = require('express');
const cors = require('cors');
const { openDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /products
app.get('/api/products', async (req, res) => {
    try {
        const db = await openDb();
        const { category } = req.query;
        let query = 'SELECT * FROM products';
        const params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        const products = await db.all(query, params);

        // Parse JSON fields
        const parsedProducts = products.map(p => ({
            ...p,
            ingredients: JSON.parse(p.ingredients || '[]'),
            sizes: p.sizes ? JSON.parse(p.sizes) : undefined
        }));

        res.json(parsedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /products/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        const db = await openDb();
        const { id } = req.params;
        const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const parsedProduct = {
            ...product,
            ingredients: JSON.parse(product.ingredients || '[]'),
            sizes: product.sizes ? JSON.parse(product.sizes) : undefined
        };

        res.json(parsedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /cart - Mock implementation
app.post('/api/cart', (req, res) => {
    const { productId, quantity, size } = req.body;
    // Here we would typically update a session cart or user cart in DB
    console.log('Added to cart:', { productId, quantity, size });
    res.json({ success: true, message: 'Item added to cart' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
