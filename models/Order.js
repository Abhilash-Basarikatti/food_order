const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant.menu'
    },
    name: {
        type: String,
        required: [true, 'Item name is required']
    },
    price: {
        type: Number,
        required: [true, 'Item price is required'],
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Item quantity is required'],
        min: [1, 'Quantity must be at least 1']
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Restaurant ID is required']
    },
    items: {
        type: [orderItemSchema],
        required: [true, 'Order must contain items'],
        validate: {
            validator: function(items) {
                return items && items.length > 0;
            },
            message: 'Order must contain at least one item'
        }
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    deliveryAddress: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required']
        }
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
            message: '{VALUE} is not a valid order status'
        },
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: {
            values: ['cash', 'card', 'upi'],
            message: '{VALUE} is not a valid payment method'
        },
        required: [true, 'Payment method is required']
    },
    specialInstructions: String,
    deliveryInstructions: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    cancelReason: String
}, {
    timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
    try {
        if (this.items && this.items.length > 0) {
            this.totalAmount = this.items.reduce((total, item) => {
                if (!item.price || !item.quantity) {
                    throw new Error('Invalid item data: price and quantity are required');
                }
                return total + (item.price * item.quantity);
            }, 0);
        } else {
            throw new Error('Order must contain at least one item');
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Order', orderSchema); 