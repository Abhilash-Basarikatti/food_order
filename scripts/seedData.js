const restaurants = [
    {
        name: "Spice Garden",
        cuisine: "Indian",
        rating: 4.5,
        description: "Authentic Indian cuisine with a modern twist",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        menu: [
            {
                name: "Butter Chicken",
                price: 16.99,
                description: "Tender chicken in rich tomato-butter sauce",
                isVegetarian: false,
                spicyLevel: "medium",
                image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db"
            },
            {
                name: "Paneer Tikka Masala",
                price: 14.99,
                description: "Grilled cottage cheese in spiced tomato gravy",
                isVegetarian: true,
                spicyLevel: "medium",
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950"
            },
            {
                name: "Vegetable Biryani",
                price: 13.99,
                description: "Fragrant rice with mixed vegetables and spices",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8"
            }
        ]
    },
    {
        name: "Sushi Master",
        cuisine: "Japanese",
        rating: 4.7,
        description: "Premium sushi and Japanese delicacies",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        menu: [
            {
                name: "Dragon Roll",
                price: 18.99,
                description: "Eel, cucumber, avocado with special sauce",
                isVegetarian: false,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351"
            },
            {
                name: "Vegetable Tempura",
                price: 12.99,
                description: "Assorted vegetables in crispy batter",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1581436473161-6d7a0013f5b0"
            }
        ]
    },
    {
        name: "Mama's Pizza",
        cuisine: "Italian",
        rating: 4.6,
        description: "Authentic Italian pizzas and pasta",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498",
        menu: [
            {
                name: "Margherita Pizza",
                price: 15.99,
                description: "Fresh tomatoes, mozzarella, and basil",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
            },
            {
                name: "Fettuccine Alfredo",
                price: 14.99,
                description: "Creamy pasta with parmesan",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a"
            }
        ]
    },
    {
        name: "Thai Orchid",
        cuisine: "Thai",
        rating: 4.4,
        description: "Authentic Thai flavors in every dish",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        menu: [
            {
                name: "Pad Thai",
                price: 13.99,
                description: "Stir-fried rice noodles with shrimp",
                isVegetarian: false,
                spicyLevel: "medium",
                image: "https://images.unsplash.com/photo-1559314809-0d155014e29e"
            },
            {
                name: "Green Curry",
                price: 15.99,
                description: "Coconut curry with vegetables",
                isVegetarian: true,
                spicyLevel: "hot",
                image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd"
            }
        ]
    },
    {
        name: "Beijing House",
        cuisine: "Chinese",
        rating: 4.5,
        description: "Traditional Chinese cuisine",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        menu: [
            {
                name: "Kung Pao Chicken",
                price: 14.99,
                description: "Spicy diced chicken with peanuts",
                isVegetarian: false,
                spicyLevel: "hot",
                image: "https://images.unsplash.com/photo-1525755662778-989d0524087e"
            },
            {
                name: "Mapo Tofu",
                price: 12.99,
                description: "Spicy tofu in Sichuan sauce",
                isVegetarian: true,
                spicyLevel: "hot",
                image: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d"
            }
        ]
    },
    {
        name: "Mediterranean Delight",
        cuisine: "Mediterranean",
        rating: 4.6,
        description: "Fresh Mediterranean flavors",
        image: "https://images.unsplash.com/photo-1544124499-58912cbddaad",
        menu: [
            {
                name: "Shawarma Plate",
                price: 15.99,
                description: "Grilled meat with rice and salad",
                isVegetarian: false,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783"
            },
            {
                name: "Falafel Wrap",
                price: 11.99,
                description: "Crispy falafel with tahini sauce",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1593001874117-c99c800c8f49"
            }
        ]
    },
    {
        name: "Burger Joint",
        cuisine: "American",
        rating: 4.3,
        description: "Gourmet burgers and fries",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
        menu: [
            {
                name: "Classic Cheeseburger",
                price: 12.99,
                description: "Beef patty with cheese and fresh veggies",
                isVegetarian: false,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
            },
            {
                name: "Veggie Burger",
                price: 11.99,
                description: "Plant-based patty with special sauce",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707"
            }
        ]
    },
    {
        name: "Seoul Kitchen",
        cuisine: "Korean",
        rating: 4.8,
        description: "Authentic Korean BBQ and more",
        image: "https://images.unsplash.com/photo-1532347922424-c652d9b7208e",
        menu: [
            {
                name: "Bulgogi",
                price: 17.99,
                description: "Marinated beef with rice",
                isVegetarian: false,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1583471889815-fa7f3961a0b6"
            },
            {
                name: "Kimchi Fried Rice",
                price: 13.99,
                description: "Spicy rice with vegetables",
                isVegetarian: true,
                spicyLevel: "hot",
                image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377"
            }
        ]
    },
    {
        name: "Taco Fiesta",
        cuisine: "Mexican",
        rating: 4.5,
        description: "Authentic Mexican street food",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        menu: [
            {
                name: "Street Tacos",
                price: 10.99,
                description: "Three tacos with choice of meat",
                isVegetarian: false,
                spicyLevel: "medium",
                image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b"
            },
            {
                name: "Veggie Burrito",
                price: 11.99,
                description: "Bean and cheese burrito with rice",
                isVegetarian: true,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85"
            }
        ]
    },
    {
        name: "Seafood Harbor",
        cuisine: "Seafood",
        rating: 4.7,
        description: "Fresh seafood daily",
        image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62",
        menu: [
            {
                name: "Grilled Salmon",
                price: 24.99,
                description: "Fresh salmon with seasonal vegetables",
                isVegetarian: false,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927"
            },
            {
                name: "Shrimp Scampi",
                price: 22.99,
                description: "Garlic butter shrimp with pasta",
                isVegetarian: false,
                spicyLevel: "mild",
                image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9"
            }
        ]
    }
];

module.exports = restaurants; 