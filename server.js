const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins (not recommended for production)
app.use(express.json());

// Connect to MongoDB (Replace with your MongoDB connection string)
mongoose.connect('mongodb+srv://coffee:Blue1088!@coffee.uvzn1x4.mongodb.net/coffee?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error('MongoDB connection error:', err));

// Create a Schema and Model for heart data
const heartSchema = new mongoose.Schema({
    heartCount: { type: Number, default: 0 }
});

const Heart = mongoose.model('Heart', heartSchema);

// Initialize heart data if not present
async function initializeHeartData() {
    const heart = await Heart.findOne();
    if (!heart) {
        const newHeart = new Heart({ heartCount: 0 });
        await newHeart.save();
    }
}
initializeHeartData();

// Get heart data
app.get('/heart', async (req, res) => {
    const heart = await Heart.findOne();
    if (!heart) {
        return res.status(404).json({ message: 'Heart data not found.' });
    }
    res.json(heart);
});

// Update heart data
app.post('/heart', async (req, res) => {
    const { hearted, userUUID } = req.body;

    // Check for missing data
    if (typeof hearted === 'undefined') {
        return res.status(400).json({ message: 'Missing hearted status.' });
    }

    const heart = await Heart.findOne();
    if (!heart) {
        return res.status(404).json({ message: 'Heart data not found.' });
    }

    // Log the hearted status and user UUID to the terminal
    console.log(`Received request: hearted=${hearted}, userUUID=${userUUID}`);

    // Update heart count based on the hearted status
    if (hearted) {
        heart.heartCount += 1; // Increment heart count
    } else {
        heart.heartCount = Math.max(0, heart.heartCount - 1); // Decrement heart count but not below 0
    }

    await heart.save();
    res.json(heart);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
