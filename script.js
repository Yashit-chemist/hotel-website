const hotels = [

{
    name: "Grand Riverside Hotel",
    image: "images/hotel1.jpg",
    price: "£120 per night",

    description:
    "Luxury hotel located beside the river with spacious rooms and beautiful views.",

    comments: [
        "★★★★★ Fantastic stay",
        "★★★★★ Great breakfast",
        "★★★★☆ Friendly staff"
    ],

    map:
    "https://maps.google.com/maps?q=glasgow&t=&z=13&ie=UTF8&iwloc=&output=embed"
},

{
    name: "Mountain Retreat",
    image: "images/hotel2.jpg",
    price: "£140 per night",

    description:
    "Quiet mountain retreat ideal for nature lovers.",

    comments: [
        "★★★★★ Amazing scenery",
        "★★★★☆ Very peaceful"
    ],

    map:
    "https://maps.google.com/maps?q=edinburgh&t=&z=13&ie=UTF8&iwloc=&output=embed"
},

{
    name: "Beach Resort",
    image: "images/hotel3.jpg",
    price: "£200 per night",

    description:
    "Modern beachfront resort with stunning ocean views.",

    comments: [
        "★★★★★ Loved the beach",
        "★★★★★ Pool was fantastic"
    ],

    map:
    "https://maps.google.com/maps?q=brighton&t=&z=13&ie=UTF8&iwloc=&output=embed"
},

{
    name: "City Centre Suites",
    image: "images/hotel4.jpg",
    price: "£95 per night",

    description:
    "Convenient location in the city centre.",

    comments: [
        "★★★★☆ Great location",
        "★★★★☆ Clean rooms"
    ],

    map:
    "https://maps.google.com/maps?q=london&t=&z=13&ie=UTF8&iwloc=&output=embed"
},

{
    name: "Royal Palace Hotel",
    image: "images/hotel5.jpg",
    price: "£300 per night",

    description:
    "Five-star luxury experience with premium services.",

    comments: [
        "★★★★★ Outstanding",
        "★★★★★ Worth every penny"
    ],

    map:
    "https://maps.google.com/maps?q=manchester&t=&z=13&ie=UTF8&iwloc=&output=embed"
}

];

let currentHotel = 0;

function showHotel(index){

    document.getElementById("hotelName").textContent =
        hotels[index].name;

    document.getElementById("hotelImage").src =
        hotels[index].image;

    document.getElementById("price").textContent =
        hotels[index].price;

    document.getElementById("description").textContent =
        hotels[index].description;

    document.getElementById("comments").innerHTML =
        hotels[index].comments
        .map(x => `<p>${x}</p>`)
        .join("");

    document.getElementById("hotelMap").src =
        hotels[index].map;
}

function nextHotel(){

    currentHotel++;

    if(currentHotel >= hotels.length)
        currentHotel = 0;

    showHotel(currentHotel);
}

function prevHotel(){

    currentHotel--;

    if(currentHotel < 0)
        currentHotel = hotels.length - 1;

    showHotel(currentHotel);
}

showHotel(0);
