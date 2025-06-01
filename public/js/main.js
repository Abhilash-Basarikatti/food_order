// DOM Elements
const loginBtn = document.getElementById('login-btn');
const cartBtn = document.getElementById('cart-btn');
const authModal = document.getElementById('auth-modal');
const cartModal = document.getElementById('cart-modal');
const closeButtons = document.querySelectorAll('.close');
const authTabs = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const restaurantList = document.getElementById('restaurant-list');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalAmount = document.getElementById('cart-total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const paymentMethodSelect = document.getElementById('payment-method');
const cartView = document.getElementById('cart-view');
const checkoutView = document.getElementById('checkout-view');
const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
const backToCartBtn = document.getElementById('back-to-cart');
const checkoutForm = document.getElementById('checkout-form');
const savedAddressSection = document.querySelector('.saved-address');
const savedAddressText = document.getElementById('saved-address-text');
const useNewAddressBtn = document.getElementById('use-new-address');
const addressForm = document.getElementById('address-form');
const placeOrderBtn = document.getElementById('place-order');

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let restaurants = [];
let allRestaurants = []; // Store all restaurants for filtering
let currentUser = null;

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    await fetchRestaurants();
});

// Authentication status check
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                updateAuthUI();
            } else {
                localStorage.removeItem('token');
                currentUser = null;
                updateAuthUI();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
            currentUser = null;
            updateAuthUI();
        }
    }
}

// Update UI based on auth status
function updateAuthUI() {
    if (currentUser) {
        loginBtn.textContent = `Logout (${currentUser.name})`;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => {
            authModal.style.display = 'block';
            // Reset forms
            loginForm.reset();
            signupForm.reset();
            // Show login tab by default
            document.querySelector('[data-tab="login"]').click();
        };
    }
}

// Event Listeners
loginBtn.addEventListener('click', () => {
    if (!currentUser) {
        authModal.style.display = 'block';
        // Reset forms
        loginForm.reset();
        signupForm.reset();
        // Show login tab by default
        document.querySelector('[data-tab="login"]').click();
    }
});

cartBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login first to view cart');
        authModal.style.display = 'block';
        return;
    }
    cartModal.style.display = 'block';
    updateCart();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').style.display = 'none';
    });
});

// Auth tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            authModal.style.display = 'none';
            updateAuthUI();
            // Reload cart data
            await loadCartFromLocalStorage();
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Login failed. Please try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});

// Signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const name = signupForm.querySelector('input[type="text"]').value.trim();
    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const password = signupForm.querySelector('input[type="password"]').value;
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            authModal.style.display = 'none';
            updateAuthUI();
            alert('Account created successfully!');
            // Initialize empty cart for new user
            cart = [];
            saveCartToLocalStorage();
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'Registration failed. Please try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
    }
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cart = [];
    updateAuthUI();
    updateCart();
    window.location.reload(); // Refresh the page to reset all state
}

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing search...');
    if (searchInput && searchBtn) {
        console.log('Search elements found');
        
        searchInput.addEventListener('input', () => {
            console.log('Search input changed:', searchInput.value);
            handleSearch();
        });

        searchBtn.addEventListener('click', (e) => {
            console.log('Search button clicked');
            e.preventDefault();
            handleSearch();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in search');
                e.preventDefault();
                handleSearch();
            }
        });
    } else {
        console.error('Search elements not found:', { searchInput, searchBtn });
    }
});

function handleSearch() {
    console.log('Handling search...');
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log('Search term:', searchTerm);
    console.log('All restaurants:', allRestaurants);
    
    if (!searchTerm) {
        console.log('Empty search, showing all restaurants');
        displayRestaurants(allRestaurants);
        return;
    }

    const filteredRestaurants = allRestaurants.filter(restaurant => {
        // Search in restaurant name and cuisine
        const matchesRestaurant = restaurant.name.toLowerCase().includes(searchTerm) ||
                                restaurant.cuisine.toLowerCase().includes(searchTerm);
        
        // Search in menu items if available
        const matchesMenu = restaurant.menu && restaurant.menu.some(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );
        
        return matchesRestaurant || matchesMenu;
    });

    console.log('Filtered restaurants:', filteredRestaurants);
    displayRestaurants(filteredRestaurants);
    
    // Add visual feedback for search
    if (filteredRestaurants.length === 0) {
        restaurantList.innerHTML = `
            <div class="no-results">
                <p>No restaurants or dishes found matching "${searchTerm}"</p>
                <button onclick="clearSearch()" class="clear-search">Clear Search</button>
            </div>
        `;
    }
}

// Add clear search function
function clearSearch() {
    searchInput.value = '';
    displayRestaurants(allRestaurants);
}

// API Calls
async function fetchRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        console.log('Fetched restaurants:', data);
        allRestaurants = data; // Store all restaurants
        restaurants = data;
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        restaurantList.innerHTML = '<p class="error">Failed to load restaurants. Please try again later.</p>';
    }
}

// UI Functions
function displayRestaurants(restaurantsToDisplay) {
    console.log('Displaying restaurants:', restaurantsToDisplay);
    if (!restaurantsToDisplay || !restaurantsToDisplay.length) {
        restaurantList.innerHTML = '<p class="no-results">No restaurants found matching your search.</p>';
        return;
    }

    restaurantList.innerHTML = restaurantsToDisplay.map(restaurant => `
        <div class="restaurant-card">
            <img src="${restaurant.image || 'https://via.placeholder.com/300x200'}" alt="${restaurant.name}">
            <h3>${restaurant.name}</h3>
            <p>${restaurant.cuisine}</p>
            <p>Rating: ${restaurant.rating ? restaurant.rating.toFixed(1) : '0'} ⭐</p>
            ${restaurant.description ? `<p class="restaurant-description">${restaurant.description}</p>` : ''}
            <button onclick="viewMenu('${restaurant._id}')">View Menu</button>
        </div>
    `).join('');
}

function updateCart() {
    try {
        if (!cartItems || !cartTotalAmount || !cartCount) {
            console.error('Required cart DOM elements not found');
            return;
        }

        console.log('Updating cart display with:', cart);

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartTotalAmount.textContent = '0.00';
            cartCount.textContent = '0';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${parseFloat(item.price).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item._id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        cartTotalAmount.textContent = total.toFixed(2);
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (checkoutBtn) checkoutBtn.disabled = false;
    } catch (error) {
        console.error('Error updating cart display:', error);
    }
}

function updateQuantity(itemId, newQuantity) {
    try {
        console.log('Updating quantity:', { itemId, newQuantity });
        
        if (newQuantity < 0) return;
        
        const itemIndex = cart.findIndex(item => item._id === itemId);
        if (itemIndex !== -1) {
            if (newQuantity === 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = newQuantity;
            }
            saveCartToLocalStorage();
            updateCart();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function viewMenu(restaurantId) {
    try {
        console.log('Viewing menu for restaurant:', restaurantId);
        const response = await fetch(`/api/restaurants/${restaurantId}/menu`);
        const menu = await response.json();
        displayMenu(menu, restaurantId);
    } catch (error) {
        console.error('Error fetching menu:', error);
        alert('Failed to load menu. Please try again.');
    }
}

function displayMenu(menu, restaurantId) {
    console.log('Displaying menu for restaurant:', restaurantId);
    console.log('Menu items:', menu);
    
    const menuHTML = menu.length ? menu.map(item => {
        const itemWithRestaurant = {
            _id: item._id,
            name: item.name,
            price: parseFloat(item.price),
            description: item.description || '',
            image: item.image,
            isVegetarian: item.isVegetarian,
            spicyLevel: item.spicyLevel,
            restaurantId: restaurantId
        };
        
        return `
            <div class="menu-item">
                <img src="${item.image || 'https://via.placeholder.com/150x150'}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p class="menu-description">${item.description || ''}</p>
                <p class="menu-price">$${parseFloat(item.price).toFixed(2)}</p>
                ${item.isVegetarian ? '<span class="veg-badge">Veg</span>' : ''}
                <p class="spicy-level">${item.spicyLevel || 'mild'}</p>
                <button onclick='addToCart(${JSON.stringify(itemWithRestaurant)})'>
                    Add to Cart
                </button>
            </div>
        `;
    }).join('') : '<p>No menu items available.</p>';
    
    const menuModal = document.createElement('div');
    menuModal.className = 'modal';
    menuModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="menu-grid">${menuHTML}</div>
        </div>
    `;
    
    document.body.appendChild(menuModal);
    menuModal.style.display = 'block';
    
    menuModal.querySelector('.close').addEventListener('click', () => {
        menuModal.remove();
    });

    menuModal.addEventListener('click', (e) => {
        if (e.target === menuModal) {
            menuModal.remove();
        }
    });
}

function addToCart(item) {
    try {
        console.log('Adding item to cart:', item);
        
        if (!currentUser) {
            alert('Please login first to add items to cart');
            authModal.style.display = 'block';
            return;
        }

        // Parse the item if it's a string (from button onclick)
        if (typeof item === 'string') {
            try {
                item = JSON.parse(item);
            } catch (e) {
                console.error('Error parsing item:', e);
                alert('Error adding item to cart');
                return;
            }
        }

        // Validate item data
        if (!item.name || !item.price || !item.restaurantId) {
            console.error('Invalid item data:', item);
            alert('Error adding item to cart: Invalid item data');
            return;
        }

        // Ensure price is a number
        const price = parseFloat(item.price);
        if (isNaN(price) || price < 0) {
            console.error('Invalid price:', item.price);
            alert('Error adding item to cart: Invalid price');
            return;
        }

        // Check if adding from a different restaurant
        if (cart.length > 0 && cart[0].restaurantId !== item.restaurantId) {
            const confirmChange = confirm('Adding items from a different restaurant will clear your current cart. Do you want to proceed?');
            if (confirmChange) {
                cart = [];
            } else {
                return;
            }
        }

        const existingItem = cart.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = {
                _id: item._id || null,
                name: item.name,
                price: price,
                quantity: 1,
                restaurantId: item.restaurantId
            };
            console.log('Adding new item to cart:', newItem);
            cart.push(newItem);
        }
        
        console.log('Current cart after adding item:', cart);
        saveCartToLocalStorage();
        updateCart();
        alert('Item added to cart!');
    } catch (error) {
        console.error('Error in addToCart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
}

function saveCartToLocalStorage() {
    try {
        console.log('Saving cart to localStorage:', cart);
        if (!Array.isArray(cart)) {
            console.error('Cart is not an array:', cart);
            cart = [];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        // Verify the save
        const savedCart = localStorage.getItem('cart');
        console.log('Verified saved cart:', savedCart);
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        console.log('Loading cart from localStorage:', savedCart);
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
            if (!Array.isArray(cart)) {
                console.error('Loaded cart is not an array:', cart);
                cart = [];
            }
        } else {
            cart = [];
        }
        
        console.log('Loaded cart:', cart);
        updateCart();
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        cart = [];
        updateCart();
    }
}

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    console.log(`Making API call to ${endpoint}:`, {
        method,
        headers: options.headers,
        data: data
    });

    const response = await fetch(endpoint, options);
    const responseData = await response.json();

    console.log(`API Response from ${endpoint}:`, {
        status: response.status,
        data: responseData
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Handle authentication error
            localStorage.removeItem('token');
            window.location.href = '/';
            throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(responseData.message || 'API call failed');
    }

    return responseData;
}

// Checkout process
proceedToCheckoutBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login first to checkout');
        authModal.style.display = 'block';
        return;
    }

    if (!cart.length) {
        alert('Your cart is empty');
        return;
    }

    // Show saved address if available
    if (currentUser.address && 
        currentUser.address.street && 
        currentUser.address.city && 
        currentUser.address.state && 
        currentUser.address.zipCode) {
        
        savedAddressText.textContent = `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} ${currentUser.address.zipCode}`;
        savedAddressSection.classList.remove('hidden');
        addressForm.classList.add('hidden');
    } else {
        savedAddressSection.classList.add('hidden');
        addressForm.classList.remove('hidden');
    }

    // Switch to checkout view
    cartView.classList.add('hidden');
    checkoutView.classList.remove('hidden');
});

// Handle "Use New Address" button
useNewAddressBtn.addEventListener('click', () => {
    savedAddressSection.classList.add('hidden');
    addressForm.classList.remove('hidden');
});

// Handle "Back to Cart" button
backToCartBtn.addEventListener('click', () => {
    checkoutView.classList.add('hidden');
    cartView.classList.remove('hidden');
});

// Handle checkout form submission
checkoutForm.addEventListener('submit', handlePlaceOrder);

async function handlePlaceOrder(e) {
    e.preventDefault();

    try {
        // Disable all form buttons to prevent double submission
        const allButtons = checkoutForm.querySelectorAll('button');
        allButtons.forEach(button => button.disabled = true);

        console.log('Starting checkout process');
        console.log('Current cart:', cart);

        if (!cart || cart.length === 0) {
            throw new Error('Your cart is empty');
        }

        const restaurantId = cart[0]?.restaurantId;
        console.log('Restaurant ID from cart:', restaurantId);

        if (!restaurantId) {
            console.error('Cart data:', cart);
            throw new Error('Restaurant information is missing. Please try adding items to cart again.');
        }

        // Get delivery address
        let deliveryAddress;
        if (!addressForm.classList.contains('hidden')) {
            // Using form address
            const streetInput = document.getElementById('street');
            const cityInput = document.getElementById('city');
            const stateInput = document.getElementById('state');
            const zipCodeInput = document.getElementById('zipCode');

            // Validate required fields
            if (!streetInput?.value || !cityInput?.value || !stateInput?.value || !zipCodeInput?.value) {
                throw new Error('Please fill in all address fields');
            }

            deliveryAddress = {
                street: streetInput.value.trim(),
                city: cityInput.value.trim(),
                state: stateInput.value.trim(),
                zipCode: zipCodeInput.value.trim()
            };

            // Save the address for future use
            try {
                const updateResponse = await apiCall(
                    '/api/auth/update-address',
                    'POST',
                    deliveryAddress
                );
                currentUser.address = deliveryAddress;
                console.log('Address saved successfully:', updateResponse);
            } catch (error) {
                console.error('Failed to save address:', error);
                // Continue with order even if address save fails
            }
        } else {
            // Using saved address
            deliveryAddress = currentUser.address;
            if (!deliveryAddress || !deliveryAddress.street) {
                throw new Error('No valid delivery address found');
            }
        }

        // Get payment method
        const paymentMethod = document.getElementById('payment-method')?.value;
        console.log('Selected payment method:', paymentMethod);
        
        if (!paymentMethod) {
            throw new Error('Please select a payment method');
        }

        // Validate payment method
        if (!['cash', 'card', 'upi'].includes(paymentMethod)) {
            throw new Error('Invalid payment method. Please select a valid payment option.');
        }

        // Get special instructions
        const specialInstructions = document.getElementById('special-instructions')?.value || '';

        // Validate cart items
        const validatedItems = cart.map(item => {
            console.log('Validating cart item:', item);
            
            if (!item.name || typeof item.price !== 'number' || !item.quantity) {
                console.error('Invalid item data:', item);
                throw new Error('Invalid item in cart. Please try removing and adding the item again.');
            }

            const validatedItem = {
                name: item.name,
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity, 10)
            };

            // Only add menuItemId if it exists and is not null
            if (item._id) {
                validatedItem.menuItem = item._id; // Changed from menuItemId to menuItem
            }

            return validatedItem;
        });

        // Calculate total amount
        const totalAmount = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create the order
        const orderData = {
            restaurantId: restaurantId, // Changed back to restaurantId
            items: validatedItems.map(item => ({
                menuItemId: item.menuItem || item._id, // Ensure we send menuItemId
                name: item.name,
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity, 10)
            })),
            deliveryAddress: {
                street: deliveryAddress.street.trim(),
                city: deliveryAddress.city.trim(),
                state: deliveryAddress.state.trim(),
                zipCode: deliveryAddress.zipCode.trim()
            },
            paymentMethod: paymentMethod,
            specialInstructions: specialInstructions,
            totalAmount: parseFloat(totalAmount.toFixed(2))
        };

        // Validate required fields before sending
        if (!orderData.restaurantId) {
            throw new Error('Restaurant ID is missing');
        }
        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw new Error('No items in order');
        }
        if (!orderData.deliveryAddress || !orderData.deliveryAddress.street) {
            throw new Error('Delivery address is missing');
        }

        console.log('Final order data being sent:', JSON.stringify(orderData, null, 2));
        
        const orderResponse = await apiCall('/api/orders', 'POST', orderData);
        console.log('Order response:', orderResponse);
        
        if (!orderResponse.orderId) {
            throw new Error('Invalid response from server. Please try again.');
        }

        // Order successful
        cart = [];
        updateCart();
        saveCartToLocalStorage();
        cartModal.style.display = 'none';

        // Format the estimated delivery time
        let deliveryTimeMessage = '';
        if (orderResponse.estimatedDeliveryTime) {
            try {
                const estimatedTime = new Date(orderResponse.estimatedDeliveryTime);
                if (!isNaN(estimatedTime.getTime())) {
                    deliveryTimeMessage = `\nEstimated delivery time: ${estimatedTime.toLocaleTimeString()}`;
                }
            } catch (error) {
                console.error('Error formatting delivery time:', error);
            }
        }
        
        alert(`Order placed successfully! Your order ID is: ${orderResponse.orderId}${deliveryTimeMessage}`);
        
    } catch (error) {
        console.error('Order submission error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            cartState: cart
        });
        alert(error.message || 'Failed to place order. Please try again.');
    } finally {
        // Re-enable all form buttons
        const allButtons = checkoutForm.querySelectorAll('button');
        allButtons.forEach(button => button.disabled = false);
    }
}

// Validate DOM elements
function validateDOMElements() {
    const requiredElements = {
        loginBtn,
        cartBtn,
        authModal,
        cartModal,
        loginForm,
        signupForm,
        restaurantList,
        cartItems,
        cartCount,
        cartTotalAmount,
        checkoutBtn,
        cartView,
        checkoutView,
        checkoutForm,
        savedAddressSection,
        savedAddressText,
        useNewAddressBtn,
        addressForm,
        placeOrderBtn
    };

    for (const [elementName, element] of Object.entries(requiredElements)) {
        if (!element) {
            console.error(`Required DOM element not found: ${elementName}`);
        }
    }
}

// Call validation on page load
document.addEventListener('DOMContentLoaded', () => {
    validateDOMElements();
    fetchRestaurants();
    loadCartFromLocalStorage();
}); 