const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// Create new order
router.post('/', async (req, res) => {
    try {
        // Log authentication info
        console.log('Auth info:', {
            hasUser: !!req.user,
            userId: req.user?.userId,
            headers: req.headers
        });

        if (!req.user || !req.user.userId) {
            console.error('User not authenticated');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log('Creating new order with data:', {
            userId: req.user.userId,
            body: JSON.stringify(req.body, null, 2)
        });

        const {
            restaurantId,
            items,
            deliveryAddress,
            paymentMethod,
            specialInstructions
        } = req.body;

        // Log validation data
        console.log('Validation check:', {
            hasRestaurantId: !!restaurantId,
            hasItems: !!items,
            itemsLength: items?.length,
            hasDeliveryAddress: !!deliveryAddress,
            hasPaymentMethod: !!paymentMethod,
            paymentMethod: paymentMethod
        });

        // Validate required fields
        if (!restaurantId || !items || !items.length || !deliveryAddress) {
            const errorMsg = 'Missing required fields. Please provide restaurantId, items, and delivery address.';
            console.log('Validation error:', errorMsg, {
                hasRestaurantId: !!restaurantId,
                hasItems: !!items,
                itemsLength: items?.length,
                hasDeliveryAddress: !!deliveryAddress
            });
            return res.status(400).json({ message: errorMsg });
        }

        // Validate payment method
        if (!paymentMethod || !['cash', 'card', 'upi'].includes(paymentMethod)) {
            const errorMsg = 'Invalid payment method. Please select cash, card, or upi.';
            console.log('Payment validation error:', errorMsg, { paymentMethod });
            return res.status(400).json({ message: errorMsg });
        }

        // Validate delivery address
        if (!deliveryAddress.street || !deliveryAddress.city || 
            !deliveryAddress.state || !deliveryAddress.zipCode) {
            const errorMsg = 'Invalid delivery address. Please provide street, city, state, and ZIP code.';
            console.log('Address validation error:', errorMsg, { deliveryAddress });
            return res.status(400).json({ message: errorMsg });
        }

        // Verify restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            const errorMsg = 'Restaurant not found';
            console.log('Restaurant validation error:', errorMsg, { restaurantId });
            return res.status(404).json({ message: errorMsg });
        }

        // Calculate total amount
        const totalAmount = items.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity, 10)), 0);
        console.log('Calculated total amount:', totalAmount);

        // Create order with validated data
        const orderData = {
            user: req.user.userId,
            restaurant: restaurantId,
            items: items.map(item => {
                // Ensure all item fields match the orderItemSchema
                const orderItem = {
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity, 10)
                };

                // Only add menuItem if it's a valid ObjectId
                if (item.menuItemId && mongoose.Types.ObjectId.isValid(item.menuItemId)) {
                    orderItem.menuItem = item.menuItemId;
                }

                return orderItem;
            }),
            deliveryAddress,
            paymentMethod: paymentMethod,
            specialInstructions: specialInstructions || '',
            status: 'pending',
            paymentStatus: 'pending',
            totalAmount: totalAmount
        };

        console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

        try {
            const order = new Order(orderData);
            console.log('Order model instance created');

            // Calculate estimated delivery time
            const now = new Date();
            let estimatedMinutes = 60; // Default to 60 minutes

            if (restaurant.deliveryTime && typeof restaurant.deliveryTime.max === 'number') {
                estimatedMinutes = Math.max(1, Math.floor(restaurant.deliveryTime.max));
            }

            // Ensure we're creating a valid date by using timestamp arithmetic
            const estimatedDeliveryTimestamp = now.getTime() + (estimatedMinutes * 60 * 1000);
            const estimatedDeliveryTime = new Date(estimatedDeliveryTimestamp);

            // Validate the date before setting it
            if (isNaN(estimatedDeliveryTime.getTime())) {
                console.error('Invalid delivery time calculated:', {
                    now,
                    estimatedMinutes,
                    estimatedDeliveryTimestamp,
                    estimatedDeliveryTime
                });
                // Use a default time of 1 hour from now if calculation failed
                order.estimatedDeliveryTime = new Date(now.getTime() + (60 * 60 * 1000));
            } else {
                order.estimatedDeliveryTime = estimatedDeliveryTime;
            }

            console.log('Delivery time details:', {
                currentTime: now,
                estimatedMinutes,
                calculatedTime: order.estimatedDeliveryTime
            });

            console.log('Attempting to save order...');
            await order.save();
            console.log('Order created successfully:', order._id);

            res.status(201).json({
                message: 'Order placed successfully',
                orderId: order._id,
                estimatedDeliveryTime: order.estimatedDeliveryTime
            });
        } catch (validationError) {
            console.error('Order validation error:', validationError);
            console.error('Validation error details:', {
                message: validationError.message,
                errors: validationError.errors,
                stack: validationError.stack
            });
            res.status(400).json({
                message: 'Invalid order data',
                error: validationError.message,
                details: validationError.errors
            });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Failed to create order. Please try again.',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get user's orders
router.get('/my-orders', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate('restaurant', 'name image')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name image address phone')
            .populate('user', 'name phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.user._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to update this order
        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update status
        order.status = status;
        if (status === 'delivered') {
            order.actualDeliveryTime = new Date();
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel order
router.post('/:id/cancel', async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        order.status = 'cancelled';
        order.cancelReason = reason;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 