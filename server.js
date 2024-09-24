// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Replace <your_mongo_url> with your MongoDB connection string)
mongoose.connect('mongodb+srv://coffee:Blue1088!@coffee.uvzn1x4.mongodb.net/coffee?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error('MongoDB connection error:', err));

// Create a Schema and Model
const heartSchema = new mongoose.Schema({
    heartCount: { type: Number, default: 0 },
    userUUIDs: [String] // Store UUIDs of users who have hearted the page
});

const Heart = mongoose.model('Heart', heartSchema);

// Initialize heart data if not present
async function initializeHeartData() {
    const heart = await Heart.findOne();
    if (!heart) {
        const newHeart = new Heart({ heartCount: 0, userUUIDs: [] });
        await newHeart.save();
    }
}
initializeHeartData();

// Get heart data
app.get('/heart', async (req, res) => {
    const heart = await Heart.findOne();
    res.json(heart);
});

// Update heart data
app.post('/heart', async (req, res) => {
    const { hearted, userUUID } = req.body;
    const heart = await Heart.findOne();

    // Check if the user has already hearted
    if (heart.userUUIDs.includes(userUUID)) {
        return res.status(403).json({ message: 'You have already hearted this page.' });
    }

    // Update heart count and add user UUID
    if (hearted) {
        heart.heartCount += 1;
        heart.userUUIDs.push(userUUID);
    } else {
        heart.heartCount -= 1;
        heart.userUUIDs = heart.userUUIDs.filter(uuid => uuid !== userUUID); // Remove UUID if unhearted
    }

    await heart.save();
    res.json(heart);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
