const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/ShopOwnerApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define schema for shop model
const shopSchema = new mongoose.Schema({
  userEmail: String,
  name: String,
  image: String,
  shopId: String,
  //username: String,
});

// Create shop model
const Shop = mongoose.model('Shop', shopSchema, 'NameAndImage');

// Define schema for location model
const locationSchema = new mongoose.Schema({
  userEmail: String,
  addressLine1: String,
  addressLine2: String,
  landmark: String,
  pincode: String,
  city: String,
  state: String,
  country: String,
  latitude: Number,
  longitude: Number,
  shopId: String,
});

// Create location model
const Location = mongoose.model('Location', locationSchema, 'Locations');

// Define schema for ShopDescription Model
const shopDescriptionSchema = new mongoose.Schema({
  userEmail: String,
  shopType: String,
  description: String,
  shopId: String,
});

// Create ShopDescription Model
const ShopDescription = mongoose.model('ShopDescription', shopDescriptionSchema, 'ShopDescription');

// Define schema for OwnerDescription model
const ownerDescriptionSchema = new mongoose.Schema({
  userEmail: String,
  ownerName: String,
  dob: String,
  phoneNumber: String,
  address: String,
  idCard: String,
  shopDocument: String,
  gstNumber: String,
  shopId: String,
});

// Create OwnerDescription model
const OwnerDescription = mongoose.model('OwnerDescription', ownerDescriptionSchema, 'OwnerDescription');

// Define the schema for subscription data
const subscriptionSchema = new mongoose.Schema({
  userEmail: String,
  plan: { type: String, required: true },
  productsLimit: { type: Number, required: true },
  premiumFeatures: { type: Boolean, default: false }, 
  shopId: String,
  // Optional, depending on your requirements
  // Add any additional fields you may need
});

// Create a model from the schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Define the schema for AddProduct model
const addProductSchema = new mongoose.Schema({
  userEmail: String,
  shopId: String,
  shopName: String,
  productName: String,
  productCategory: String,
  productDescription: String,
  productImage: String,
  ProductId: String,
  shopId: String,
});

// Create AddProduct model
const AddProduct = mongoose.model('AddProduct', addProductSchema, 'AddProduct1');

// Define the schema for Priceset
const pricesetSchema = new mongoose.Schema({
  userEmail: String,
  shopId: String,
  productPrice: Number,
  ProductId: String,
  pricingPlans: [{
    quantity: Number,
    totalPrice: Number,
  }],
});

// Create a model from the schema
const Priceset = mongoose.model('Priceset', pricesetSchema);

// Stock Schema
const stockSchema = new mongoose.Schema({
  ProductId: String,
  userEmail: { type: String, required: true },
  shopId: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  expiryDate: { type: Date }
});

const Stock = mongoose.model('Stock', stockSchema);

// Multer middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original filename for uploaded files
  }
});

const upload = multer({ storage: storage });
// Middleware to parse JSON
app.use(express.json());

// Route to get all shops
app.get('/api/NameAndImage', async (req, res) => {
  try {
    const { userEmail} = req.query;
    const shops = await Shop.find({ userEmail });
    res.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to create a new shop
app.post('/api/NameAndImage', upload.single('shopImage'), async (req, res) => {
  try {
    const userEmail = req.body.email; // Retrieve email directly from req.body
    const shopName = req.body.shopName;
    const shopId = req.body.shopId;
    let shopImage = null;
    // Check if an image was uploaded
    if (req.file) {
      shopImage = req.file.filename; // Assuming multer saves the file with a random filename
    }

    // Save shop data to MongoDB
    const shop = new Shop({
      userEmail,
      name: shopName,
      image: shopImage,
      shopId: shopId
    });
    await shop.save();

    res.status(201).send('Shop data stored successfully');
  } catch (error) {
    console.error('Error storing shop data:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to delete shop data associated with a user email
app.delete('/api/NameAndImage', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Delete shop data based on userEmail
    await Shop.deleteMany({ userEmail});
    res.status(200).send('Shop data deleted successfully');
  } catch (error) {
    console.error('Error deleting shop data:', error);
    res.status(500).send('Internal server error');
  }
});


// Route to create a new location
app.post('/api/Locations', async (req, res) => {
  try {
    const {
      addressLine1,
      addressLine2,
      landmark,
      pincode,
      city,
      state,
      country,
      latitude,
      longitude,
      shopId
    } = req.body;

    const userEmail = req.body.email;

    // Save location data to MongoDB
    const location = new Location({
      userEmail,
      addressLine1,
      addressLine2,
      landmark,
      pincode,
      city,
      state,
      country,
      latitude,
      longitude,
      shopId
    });
    await location.save();

    res.status(201).send('Location data stored successfully');
  } catch (error) {
    console.error('Error storing location data:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get all locations
app.get('/api/Locations', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Fetch all locations from the database based on userEmail
    const locations = await Location.find({ userEmail});
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to delete location data associated with a user email
app.delete('/api/Locations', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Delete location data based on userEmail
    await Location.deleteMany({ userEmail});
    res.status(200).send('Location data deleted successfully');
  } catch (error) {
    console.error('Error deleting location data:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to create a new shop description 
app.post('/api/ShopDescription', async (req, res) => {
  try {
    const {  shopType, description, shopId } = req.body;
    const userEmail = req.body.userEmail;

    // Save shop description data to MongoDB
    const shopDescription = new ShopDescription({
      userEmail,
      shopType,
      description,
      shopId
    });
    await shopDescription.save();

    res.status(201).send('Shop description stored successfully');
  } catch (error) {
    console.error('Error storing shop description:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get all shop descriptions
app.get('/api/ShopDescription', async (req, res) => {
  try {
    const { userEmail } = req.query;
    // Fetch all shop descriptions from the database based on userEmail
    const shopDescriptions = await ShopDescription.find({ userEmail, shopId });
    res.json(shopDescriptions);
  } catch (error) {
    console.error('Error fetching shop descriptions:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to delete shop description data associated with a user email
app.delete('/api/ShopDescription', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Delete shop description data based on userEmail
    await ShopDescription.deleteMany({ userEmail});
    res.status(200).send('Shop description data deleted successfully');
  } catch (error) {
    console.error('Error deleting shop description data:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to create a new owner description
app.post('/api/OwnerDescription', upload.fields([{ name: 'idCard', maxCount: 1 }, { name: 'shopDocument', maxCount: 1 }]), async (req, res) => {
  try {
    const {
      ownerName,
      dob,
      phoneNumber,
      address,
      gstNumber,
      shopId
    } = req.body;
     const userEmail = req.body.userEmail;

    let idCard = '';
    let shopDocument = '';

    // Check if idCard file is uploaded
    if (req.files['idCard']) {
      idCard = req.files['idCard'][0].filename;
    }

    // Check if shopDocument file is uploaded
    if (req.files['shopDocument']) {
      shopDocument = req.files['shopDocument'][0].filename;
    }

    // Save owner description data to MongoDB
    const ownerDescription = new OwnerDescription({
      userEmail,
      ownerName,
      dob,
      phoneNumber,
      address,
      idCard,
      shopDocument,
      gstNumber,
      shopId
    });
    await ownerDescription.save();

    res.status(201).send('Owner description data stored successfully');
  } catch (error) {
    console.error('Error storing owner description data:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get all owner descriptions
app.get('/api/OwnerDescription', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Fetch all owner descriptions from the database based on userEmail
    const ownerDescriptions = await OwnerDescription.find({ userEmail });
    res.json(ownerDescriptions);
  } catch (error) {
    console.error('Error fetching owner descriptions:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to delete owner description data associated with a user email
app.delete('/api/OwnerDescription', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Delete owner description data based on userEmail
    await OwnerDescription.deleteMany({ userEmail});
    res.status(200).send('Owner description data deleted successfully');
  } catch (error) {
    console.error('Error deleting owner description data:', error);
    res.status(500).send('Internal server error');
  }
});


// Route to create a new subscription
app.post('/api/Subscriptions', async (req, res) => {
  try {
    const {  plan, productsLimit, premiumFeatures, shopId } = req.body;
    const userEmail = req.body.userEmail;

    // Create a new subscription document
    const subscription = new Subscription({
      userEmail,
      plan,
      productsLimit,
      premiumFeatures,
      shopId
    });

    // Save the subscription to the database
    await subscription.save();

    res.status(201).send('Subscription created successfully');
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get all subscriptions
app.get('/api/Subscriptions', async (req, res) => {
  try {
    const { userEmail} = req.query;
    // Fetch all subscriptions from the database based on userEmail
    const subscriptions = await Subscription.find({ userEmail });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to delete subscription data associated with a user email
app.delete('/api/Subscriptions', async (req, res) => {
  try {
    const { userEmail } = req.query;
    // Delete subscription data based on userEmail
    await Subscription.deleteMany({ userEmail});
    res.status(200).send('Subscription data deleted successfully');
  } catch (error) {
    console.error('Error deleting subscription data:', error);
    res.status(500).send('Internal server error');
  }
});

// POST method to add a new product
app.post('/api/AddProduct', upload.single('productImage'), async (req, res) => {
  try {
    const {
      userEmail,
      shopId,
      shopName,
      productName,
      productCategory,
      productDescription,
      ProductId,
    } = req.body;

    const productImage = req.file ? req.file.filename : null;

    const newProduct = new AddProduct({
      userEmail,
      shopId,
      shopName,
      productName,
      productCategory,
      productDescription,
      productImage,
      ProductId
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET method to fetch all products by userEmail and shopId
app.get('/api/AddProduct', async (req, res) => {
 

  try {
    const { userEmail, shopId } = req.query;
    // Fetch all subscriptions from the database based on userEmail
    const products = await AddProduct.find({ userEmail, shopId });
   
    //const products = await AddProduct.find({ userEmail, shopId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE method to delete all products by userEmail and shopId
app.delete('/api/AddProduct', async (req, res) => {
  try {
    const { userEmail, shopId } = req.query;
    await AddProduct.deleteMany({ userEmail, shopId });
    res.status(200).json({ message: 'All products deleted successfully' });
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to create a new Priceset
app.post('/api/Priceset', async (req, res) => {
  try {
    const { userEmail, shopId, productPrice, pricingPlans, ProductId } = req.body;

    // Save Priceset data to MongoDB
    const priceset = new Priceset({ userEmail, shopId, productPrice, pricingPlans, ProductId });
    await priceset.save();

    res.status(201).send('Priceset data stored successfully');
  } catch (error) {
    console.error('Error storing Priceset data:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get Priceset by userEmail and shopId
app.get('/api/Priceset', async (req, res) => {
  try {
    const { userEmail, shopId, ProductId } = req.query;

    // Fetch Priceset from the database based on userEmail and shopId
    const priceset = await Priceset.findOne({ userEmail, shopId, ProductId });
    if (!priceset) {
      return res.status(404).json({ error: 'Priceset not found' });
    }
    res.json(priceset);
  } catch (error) {
    console.error('Error fetching Priceset:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to delete Priceset data associated with a user email
app.delete('/api/Priceset', async (req, res) => {
  try {
    const { userEmail, shopId, ProductId} = req.query;

    // Delete Priceset data based on userEmail
    await Priceset.deleteMany({ userEmail, shopId, ProductId });
    res.status(200).send('Priceset data deleted successfully');
  } catch (error) {
    console.error('Error deleting Priceset data:', error);
    res.status(500).send('Internal server error');
  }
});

// Post stock
app.post('/api/stocks', async (req, res) => {
  try {
    const { userEmail, shopId, stockQuantity, expiryDate, ProductId } = req.body;
    const stock = new Stock({
      userEmail,
      shopId,
      stockQuantity,
      expiryDate,
      ProductId
    });
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    console.error('Error saving stock:', error);
    res.status(500).json({ error: 'Failed to save stock information.' });
  }
});

 // get Stock
app.get('/api/stocks', async (req, res) => {
  try {
    const { userEmail, shopId, ProductId } = req.params;
    const stocks = await Stock.find({ userEmail, shopId, ProductId });
    res.json(stocks);
  } catch (error) {
    console.error('Error retrieving stocks:', error);
    res.status(500).json({ error: 'Failed to retrieve stocks.' });
  }
});

// delete stock
app.delete('/api/stocks', async (req, res) => {
  try {
    const { userEmail, shopId } = req.params;
    await Stock.deleteOne({ userEmail, shopId, ProductId });
    res.json({ message: 'Stock deleted successfully.' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock.' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
