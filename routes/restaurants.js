const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all restaurants...');
        const restaurants = await Restaurant.find();
        console.log(`Found ${restaurants.length} restaurants`);
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Error fetching restaurants' });
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`Fetching restaurant with ID: ${req.params.id}`);
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            console.log('Restaurant not found');
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        console.log('Restaurant found:', restaurant.name);
        res.json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Error fetching restaurant' });
    }
});

// Get restaurant menu
router.get('/:id/menu', async (req, res) => {
    try {
        console.log(`Fetching menu for restaurant ID: ${req.params.id}`);
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            console.log('Restaurant not found');
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        console.log(`Found menu with ${restaurant.menu.length} items`);
        res.json(restaurant.menu);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ message: 'Error fetching menu' });
    }
});

// Add review to restaurant
router.post('/:id/reviews', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const review = {
            user: req.user.userId,
            rating,
            comment
        };

        restaurant.reviews.push(review);

        // Update restaurant rating
        const totalRating = restaurant.reviews.reduce((sum, item) => sum + item.rating, 0);
        restaurant.rating = totalRating / restaurant.reviews.length;

        await restaurant.save();
        res.json(restaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search restaurants
router.get('/search/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query;
        console.log('Searching restaurants with query:', searchQuery);
        const restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { cuisine: { $regex: searchQuery, $options: 'i' } },
                { 'menu.name': { $regex: searchQuery, $options: 'i' } }
            ]
        });
        console.log(`Found ${restaurants.length} restaurants matching query`);
        res.json(restaurants);
    } catch (error) {
        console.error('Error searching restaurants:', error);
        res.status(500).json({ message: 'Error searching restaurants' });
    }
});

module.exports = router; 