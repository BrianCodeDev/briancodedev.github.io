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
mongoose.connect('mongodb+srv://coffee:Blue1088!@coffee.uvzn1x4.mongodb.net/?retryWrites=true&w=majority&appName=coffee', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

// Create a Schema and Model
const heartSchema = new mongoose.Schema({
    heartCount: { type: Number, default: 0 },
    hearted: { type: Boolean, default: false }
});

const Heart = mongoose.model('Heart', heartSchema);

// Initialize heart data if not present
async function initializeHeartData() {
    const heart = await Heart.findOne();
    if (!heart) {
        const newHeart = new Heart({ heartCount: 0, hearted: false });
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
    const { hearted } = req.body;
    const heart = await Heart.findOne();
    if (hearted) {
        heart.heartCount += 1;
    } else {
        heart.heartCount -= 1;
    }
    heart.hearted = hearted;
    await heart.save();
    res.json(heart);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
