const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const restaurants = require('./seedData');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/zomato_clone';

async function validateData() {
    console.log('Validating restaurant data...');
    console.log(`Found ${restaurants.length} restaurants to validate`);
    
    restaurants.forEach((restaurant, index) => {
        console.log(`Validating restaurant ${index + 1}/${restaurants.length}: ${restaurant.name}`);
        
        if (!restaurant.name || !restaurant.cuisine || !restaurant.menu) {
            throw new Error(`Invalid restaurant data at index ${index}: Missing required fields`);
        }
        
        console.log(`Validating ${restaurant.menu.length} menu items for ${restaurant.name}`);
        restaurant.menu.forEach((item, itemIndex) => {
            if (!item.name || typeof item.price !== 'number') {
                throw new Error(`Invalid menu item at restaurant "${restaurant.name}", item index ${itemIndex}`);
            }
        });
    });
    console.log('Data validation successful');
}

async function seedDatabase() {
    let connection;
    try {
        // Validate data first
        await validateData();

        // Connect to MongoDB
        console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
        connection = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');

        // Get database stats before seeding
        const beforeCount = await Restaurant.countDocuments();
        console.log(`Current restaurant count before seeding: ${beforeCount}`);

        // Upsert each restaurant
        console.log('Upserting restaurants...');
        for (const restaurant of restaurants) {
            await Restaurant.findOneAndUpdate(
                { name: restaurant.name },
                restaurant,
                { 
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );
            console.log(`Upserted restaurant: ${restaurant.name}`);
        }

        // Verify the insertion
        const afterCount = await Restaurant.countDocuments();
        console.log(`Total restaurants in database after seeding: ${afterCount}`);

        // Log each restaurant that was added or updated
        const updatedRestaurants = await Restaurant.find({});
        updatedRestaurants.forEach(restaurant => {
            console.log(`Restaurant in DB: ${restaurant.name} with ${restaurant.menu.length} menu items`);
        });

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error during database seeding:', error);
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack
        });
        process.exit(1);
    } finally {
        // Close the database connection
        if (connection) {
            await connection.connection.close();
            console.log('Database connection closed');
        }
        process.exit(0);
    }
}

// Run the seeding function
console.log('Starting database seeding process...');
seedDatabase(); 