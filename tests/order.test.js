const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const { generateToken } = require('../utils/auth');

describe('Order API', () => {
  let token;
  let user;
  let restaurant;

  beforeEach(async () => {
    // Create test user
    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create test restaurant
    restaurant = await Restaurant.create({
      name: 'Test Restaurant',
      description: 'Test Description',
      cuisine: 'Test Cuisine',
      deliveryTime: { min: 30, max: 45 }
    });

    // Generate token for authentication
    token = generateToken(user);
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        restaurantId: restaurant._id,
        items: [{
          name: 'Test Item',
          price: 10.99,
          quantity: 2
        }],
        deliveryAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        },
        paymentMethod: 'card'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('orderId');
      expect(response.body).toHaveProperty('estimatedDeliveryTime');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({});

      expect(response.status).toBe(401);
    });
  });
}); 