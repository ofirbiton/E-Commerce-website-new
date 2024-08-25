// /*<!-- Ofir Biton 208582494 & Noe Mignolet 209709260 -->*/
const express = require('express');
const mongojs = require('mongojs');
const cors = require('cors');

// Connecting to the database
const db = mongojs('mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024', ['final_<Ofir_Noe>_Products', 'final_<Ofir_Noe>_Orders']);

// Establishing the app
const app = express();
app.use(cors());
app.use(express.json());

// Edit this line to point to your specific collection
const productsCollection = db.collection('final_<Ofir_Noe>_Products'); 
const ordersCollection = db.collection('final_<Ofir_Noe>_Orders');

// Function to generate a unique 8-digit order number
const generateUniqueOrderNumber = (callback) => {
  let orderNumber;
  const generateNumber = () => {
    orderNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    ordersCollection.findOne({ orderNumber }, (err, existingOrder) => {
      if (err) {
        return callback(err);
      }
      if (existingOrder) {
        generateNumber(); // Try again if the number already exists
      } else {
        callback(null, orderNumber);
      }
    });
  };
  generateNumber();
};

// -------------Products-------------

// GET all products
app.get('/products', (req, res) => {
  productsCollection.find((err, docs) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.status(200).json(docs);
    }
  });
});

// GET a single product by ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  productsCollection.findOne({ _id: mongojs.ObjectId(id) }, (err, doc) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch product' });
    } else if (!doc) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(doc);
    }
  });
});

// -------------Orders-------------

// GET all orders
app.get('/orders', (req, res) => {
  ordersCollection.find((err, docs) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    } else {
      res.status(200).json(docs);
    }
  });
});

// GET a single order by ID
app.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  ordersCollection.findOne({ _id: mongojs.ObjectId(id) }, (err, doc) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch order' });
    } else if (!doc) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      res.status(200).json(doc);
    }
  });
});

// POST a new order
app.post('/orders', (req, res) => {
  const { name, email, phone, address, shippingMethod, cartItems, totalPrice } = req.body;

  if (!name || !email || !phone || !address || !cartItems.length || !totalPrice) {
    return res.status(400).json({ error: 'All fields are required and cart cannot be empty.' });
  }

  generateUniqueOrderNumber((err, orderNumber) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate order number' });
    }

    const newOrder = {
      orderNumber,
      name,
      email,
      phone,
      address,
      shippingMethod,
      cartItems,
      totalPrice,
      orderDate: new Date(),
    };

    ordersCollection.insert(newOrder, (err, doc) => {
      if (err) {
        res.status(500).json({ error: 'Failed to place order' });
      } else {
        res.status(201).json({ message: 'Order placed successfully', orderNumber });
      }
    });
  });
});

// DELETE an order by ID
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  ordersCollection.remove({ _id: mongojs.ObjectId(id) }, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete order' });
    } else if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      res.status(200).json({ message: 'Order deleted successfully' });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});