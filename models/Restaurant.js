const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    category: String,
    isVegetarian: {
        type: Boolean,
        default: false
    },
    spicyLevel: {
        type: String,
        enum: ['mild', 'medium', 'hot'],
        default: 'medium'
    }
});

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    phone: String,
    email: String,
    image: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    menu: {
        type: [menuItemSchema],
        default: []
    },
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deliveryTime: {
        min: Number,
        max: Number
    },
    minimumOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add indexes for better search performance
restaurantSchema.index({ name: 'text', cuisine: 'text', 'menu.name': 'text' });

// Virtual for average rating
restaurantSchema.virtual('averageRating').get(function() {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
});

// Create the model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant; 