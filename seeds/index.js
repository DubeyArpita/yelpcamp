const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("mongo connection open");
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

//const UNSPLASH_ACCESS_KEY = 'QJl9ffgqlEovyIlHvDrnetvqkAArwZVVtZKapALrjsg'; // Replace with your Unsplash API key

// const getUnsplashImage = async () => {
//     try {
//         const response = await fetch(
//             `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&collections=483251`
//         );
//         const data = await response.json();
//         return data.urls.small; // Fetch the "small" size image
//     } catch (err) {
//         console.error("Error fetching Unsplash image:", err);
//         return 'https://via.placeholder.com/300'; // Fallback image URL
//     }
// };

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            author: '678ab8afb6c42b3af1d3e014',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, dolorem! Labore optio molestias esse quibusdam minus iusto quisquam vel. Impedit excepturi quaerat nostrum id dicta alias sunt hic culpa accusamus?',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dnxu5rlav/image/upload/v1737307177/YelpCamp/kbvpiu2a6zncdep4htvv.jpg',
                  filename: 'YelpCamp/kbvpiu2a6zncdep4htvv',
                },
                {
                  url: 'https://res.cloudinary.com/dnxu5rlav/image/upload/v1737307178/YelpCamp/oixdmvmslbbslktjzhco.jpg',
                  filename: 'YelpCamp/oixdmvmslbbslktjzhco',
                }
            ]
        });
        await camp.save();
        
    };

};

seedDB().then(() => {
    mongoose.connection.close();
});
