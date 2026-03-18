import { Branch, CartItem, MenuCategory, StoreInfo } from "@/types";

export const dummyData: MenuCategory[] = [
    {
        id: 'burgers',
        name: 'Burgers',
        items: [
            {
                id: 'b1',
                name: 'Classic Smash Burger',
                description: 'Double smashed patty, American cheese, pickles, special sauce',
                price: 32,
                image: 'https://instagram.fdmm2-2.fna.fbcdn.net/v/t51.82787-15/629804589_18403622104133836_5854726276733856929_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzA3Nzk3Nzc4OTkzNTE0ODIxNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=CovqGGZ6V24Q7kNvwEjqnS8&_nc_oc=AdlhPcJGoMx3LsoTY4SIZxTL-GPBwy5B6Ov-9pS9IvL9ECupyLpxtvvIh0-VXdvzLdFhOpWVpzr0_-NUd5VGjrfN&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdmm2-2.fna&_nc_gid=Z3l0iWf4YuDTRaV2DQqp_w&_nc_ss=8&oh=00_AfxIZB-H0tF6HWCk7nbCs3Qq0elS2_q-Ia9_GmS8M723xg&oe=69BD5866',
                variants: [
                    {
                        id: 'b1-patty',
                        name: 'Patty Type',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Beef', price: 0 },
                            { label: 'Chicken', price: 0 },
                            { label: 'Plant-based', price: 5 },
                        ],
                    },
                    {
                        id: 'b1-cheese',
                        name: 'Extra Cheese',
                        type: 'checkbox',
                        options: [
                            { label: 'American Cheese', price: 3 },
                            { label: 'Cheddar Cheese', price: 3 },
                            { label: 'Swiss Cheese', price: 4 },
                        ],
                    },
                    {
                        id: 'b1-extras',
                        name: 'Add Extras',
                        type: 'checkbox',
                        options: [
                            { label: 'Bacon', price: 5 },
                            { label: 'Fried Egg', price: 4 },
                            { label: 'Jalapeños', price: 2 },
                            { label: 'Caramelized Onions', price: 2 },
                        ],
                    },
                ],
            },
            {
                id: 'b2',
                name: 'Crispy Chicken Burger',
                description: 'Buttermilk fried chicken, coleslaw, honey mustard',
                price: 28,
                image: 'https://instagram.fdmm2-4.fna.fbcdn.net/v/t51.82787-15/624624543_18143047318463262_7613668689861422435_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=MzI2MjA1MDk3MjMyNDYyODgwMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=G5_5shggGo0Q7kNvwGTZoST&_nc_oc=AdlTIApZRMM0m4cz9N5hhNX88Njg0Afn8M3YY8B64ekmOakYPxOdYIIUeSJDcqWFSB4PJDD3utgvPLjQtemOY7mE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdmm2-4.fna&_nc_gid=8tPeGOqQt1aOqq4d0LXSRA&_nc_ss=8&oh=00_AfyLvb4Uq4d42mISoXQJ5uEAQf3u3jJ97ZKh13TgrSxW3g&oe=69BD4273',
                variants: [
                    {
                        id: 'b2-spice',
                        name: 'Spice Level',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Mild', price: 0 },
                            { label: 'Medium', price: 0 },
                            { label: 'Hot', price: 0 },
                            { label: 'Extra Hot', price: 2 },
                        ],
                    },
                    {
                        id: 'b2-sauces',
                        name: 'Extra Sauces',
                        type: 'checkbox',
                        options: [
                            { label: 'Honey Mustard', price: 2 },
                            { label: 'BBQ Sauce', price: 2 },
                            { label: 'Ranch', price: 2 },
                            { label: 'Spicy Mayo', price: 2 },
                        ],
                    },
                ],
            },
            {
                id: 'b3',
                name: 'BBQ Bacon Burger',
                description: 'Beef patty, crispy bacon, cheddar, BBQ sauce, onion rings',
                price: 38,
                image: 'https://instagram.fdmm2-3.fna.fbcdn.net/v/t51.82787-15/623289291_18041081375736629_8322225843438828384_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzI5ODkzOTE5MzU5OTc4MDkxMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=_06DZqZR9LUQ7kNvwFZl0YC&_nc_oc=Adl_rysXMp-Y0nbEbSKRkc8iIVaV4RzZNHDdm3DqvE4aWzIyxM2KgPvJTcPcKyt-1HfBv0xqVZezUGnFIrAflT23&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdmm2-3.fna&_nc_gid=8tPeGOqQt1aOqq4d0LXSRA&_nc_ss=8&oh=00_AfwrVn-0U4X4nm6Dt-5ND0lnafaz3EEHHrX40kaxMlSODg&oe=69BD49E0',
                variants: [
                    {
                        id: 'b3-bacon',
                        name: 'Bacon Style',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Crispy Bacon', price: 0 },
                            { label: 'Chewy Bacon', price: 0 },
                            { label: 'Extra Bacon', price: 6 },
                        ],
                    },
                    {
                        id: 'b3-toppings',
                        name: 'Add Toppings',
                        type: 'checkbox',
                        options: [
                            { label: 'Grilled Mushrooms', price: 3 },
                            { label: 'Jalapeños', price: 2 },
                            { label: 'Pickles', price: 1 },
                            { label: 'Tomato', price: 1 },
                        ],
                    },
                ],
            },
            {
                id: 'b4',
                name: 'Mushroom Swiss Burger',
                description: 'Sautéed mushrooms, Swiss cheese, garlic aioli, brioche bun',
                price: 35,
                image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80',
                variants: [
                    {
                        id: 'b4-mushrooms',
                        name: 'Mushroom Type',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'White Mushrooms', price: 0 },
                            { label: 'Portobello', price: 2 },
                            { label: 'Mixed Mushrooms', price: 3 },
                        ],
                    },
                    {
                        id: 'b4-sauce',
                        name: 'Extra Sauce',
                        type: 'checkbox',
                        options: [
                            { label: 'Garlic Aioli', price: 2 },
                            { label: 'Truffle Mayo', price: 3 },
                            { label: 'Swiss Cheese Sauce', price: 4 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'sides',
        name: 'Sides',
        items: [
            {
                id: 's1',
                name: 'Loaded Fries',
                description: 'Crispy fries topped with cheese sauce, jalapeños, bacon bits',
                price: 18,
                image: 'https://images.unsplash.com/photo-1576107232684-1279f8b6e0c7?w=200&q=80',
                variants: [
                    {
                        id: 's1-size',
                        name: 'Size',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Regular', price: 0 },
                            { label: 'Large', price: 6 },
                            { label: 'Share Size', price: 10 },
                        ],
                    },
                    {
                        id: 's1-toppings',
                        name: 'Extra Toppings',
                        type: 'checkbox',
                        options: [
                            { label: 'Extra Cheese', price: 3 },
                            { label: 'Extra Bacon', price: 4 },
                            { label: 'Sour Cream', price: 2 },
                            { label: 'Guacamole', price: 5 },
                        ],
                    },
                ],
            },
            {
                id: 's2',
                name: 'Onion Rings',
                description: 'Beer-battered onion rings with chipotle dip',
                price: 14,
                image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=200&q=80',
                variants: [
                    {
                        id: 's2-dip',
                        name: 'Choose Dip',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Chipotle', price: 0 },
                            { label: 'Ranch', price: 0 },
                            { label: 'BBQ', price: 0 },
                            { label: 'Garlic Mayo', price: 1 },
                        ],
                    },
                ],
            },
            {
                id: 's3',
                name: 'Coleslaw',
                description: 'House-made creamy coleslaw with fresh herbs',
                price: 10,
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80',
            },
        ],
    },
    {
        id: 'drinks',
        name: 'Drinks',
        items: [
            {
                id: 'd1',
                name: 'Milkshake',
                description: 'Thick hand-spun shakes — vanilla, chocolate, or strawberry',
                price: 22,
                image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&q=80',
                variants: [
                    {
                        id: 'd1-flavor',
                        name: 'Flavor',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Vanilla', price: 0 },
                            { label: 'Chocolate', price: 0 },
                            { label: 'Strawberry', price: 0 },
                            { label: 'Oreo', price: 4 },
                            { label: 'Nutella', price: 5 },
                        ],
                    },
                    {
                        id: 'd1-toppings',
                        name: 'Add Toppings',
                        type: 'checkbox',
                        options: [
                            { label: 'Whipped Cream', price: 2 },
                            { label: 'Chocolate Syrup', price: 2 },
                            { label: 'Sprinkles', price: 1 },
                            { label: 'Cherry', price: 1 },
                        ],
                    },
                ],
            },
            {
                id: 'd2',
                name: 'Fresh Lemonade',
                description: 'House-squeezed lemonade with mint',
                price: 15,
                image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80',
                variants: [
                    {
                        id: 'd2-flavor',
                        name: 'Flavor',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Classic', price: 0 },
                            { label: 'Strawberry', price: 3 },
                            { label: 'Mango', price: 3 },
                            { label: 'Watermelon', price: 3 },
                        ],
                    },
                    {
                        id: 'd2-size',
                        name: 'Size',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Regular', price: 0 },
                            { label: 'Large', price: 5 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'desserts',
        name: 'Desserts',
        items: [
            {
                id: 'de1',
                name: 'Nutella Waffle',
                description: 'Crispy Belgian waffle, Nutella, banana slices, powdered sugar',
                price: 25,
                image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200&q=80',
                variants: [
                    {
                        id: 'de1-toppings',
                        name: 'Extra Toppings',
                        type: 'checkbox',
                        options: [
                            { label: 'Strawberries', price: 4 },
                            { label: 'Blueberries', price: 4 },
                            { label: 'Chocolate Sauce', price: 2 },
                            { label: 'Ice Cream', price: 5 },
                        ],
                    },
                ],
            },
            {
                id: 'de2',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
                price: 28,
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80',
                variants: [
                    {
                        id: 'de2-icecream',
                        name: 'Ice Cream Flavor',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Vanilla', price: 0 },
                            { label: 'Chocolate', price: 0 },
                            { label: 'Strawberry', price: 0 },
                        ],
                    },
                    {
                        id: 'de2-sauce',
                        name: 'Extra Sauce',
                        type: 'checkbox',
                        options: [
                            { label: 'Chocolate Sauce', price: 2 },
                            { label: 'Caramel Sauce', price: 2 },
                            { label: 'Raspberry Sauce', price: 2 },
                        ],
                    },
                ],
            },
        ],
    },
];

export const storeInfo: StoreInfo = {
    name: 'Burger Boutique',
    logo: 'https://images.deliveryhero.io/image/hungerstation/restaurant/logo_ar/e56ee8fefc7b34f753ee5edb48c894d1.png?width=96&quality=75&webp=true',
    banner: 'https://instagram.fdmm2-3.fna.fbcdn.net/v/t39.30808-6/466986807_18008321969664802_7086431983257528169_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzM5OTcxNjM0OTE4MjczOTIxMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTA4MC5zZHIuQzMifQ%3D%3D&_nc_ohc=EgBQnHb6qXwQ7kNvwFzyYnH&_nc_oc=AdnKtm_lSRHe-jjGYvbogoSIOhsC0Hif2fwuhz9TjpzWOY1A1dPdlWrsEpuiqrT_vDtBw5WfoKsC-XuboXHMDzmi&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdmm2-3.fna&_nc_gid=8c9hRntTFt4fm-XQGiwcjQ&_nc_ss=8&oh=00_AfwEhWP1rUHSCGSte6Zs-y_KfeWXble_ZLgbZjk_wBZB6A&oe=69BD3B91',
    categories: 'Burgers · American · Fast Food',
    rating: 4.7,
    reviewCount: '2.3k',
    deliveryTime: '25–35 min',
    isOpen: true,
};

export const branches: Branch[] = [
    {
        id: 'branch-1',
        name: 'Downtown Branch',
        address: '123 Main St',
        status: 'Open now',
    },
    {
        id: 'branch-2',
        name: 'Mall Branch',
        address: 'City Mall, Floor 2',
        status: 'Open now',
    },
    {
        id: 'branch-3',
        name: 'Airport Branch',
        address: 'Terminal 1',
        status: '24/7',
    },
];

export const cartItems: CartItem[] = [
    {
        id: 'item-1',
        name: 'Chicken Shawarma',
        description: 'Classic chicken shawarma with garlic sauce',
        price: 18,
        quantity: 2,
        size: 'Large',
        image: 'https://instagram.fdmm2-2.fna.fbcdn.net/v/t51.82787-15/629804589_18403622104133836_5854726276733856929_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzA3Nzk3Nzc4OTkzNTE0ODIxNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=CovqGGZ6V24Q7kNvwEjqnS8&_nc_oc=AdlhPcJGoMx3LsoTY4SIZxTL-GPBwy5B6Ov-9pS9IvL9ECupyLpxtvvIh0-VXdvzLdFhOpWVpzr0_-NUd5VGjrfN&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdmm2-2.fna&_nc_gid=Z3l0iWf4YuDTRaV2DQqp_w&_nc_ss=8&oh=00_AfxIZB-H0tF6HWCk7nbCs3Qq0elS6_q-Ia9_GmS8M723xg&oe=69BD5866',
    },
    {
        id: 'item-2',
        name: 'Fries Combo',
        description: 'Crispy golden fries',
        price: 12.5,
        quantity: 1,
        size: 'Regular',
        image: 'https://images.unsplash.com/photo-1576107232694-9c3e518a126a?w=200&q=80',
    },
];

export const mapConfig = {
    defaultCenter: { lat: 24.7136, lng: 46.6753 },
    zoom: 13,
};

export const primaryColor = '#3F4093';
export const secondaryColor = '#E0E1FF';