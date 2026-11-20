import mongoose from "mongoose";
import dotenv from "dotenv";
import { Sweet } from "../models/sweet.model.js";

dotenv.config();

const sweets = [
  // Indian
  { name: "Gulab Jamun", category: "Indian", description: "Soft milk-solid dumplings soaked in rose-cardamom syrup.", price: 20, quantityInStock: 120, imageUrl: "https://placehold.co/600x400?text=Gulab+Jamun" },
  { name: "Rasgulla", category: "Indian", description: "Spongy cottage cheese balls in light sugar syrup.", price: 18, quantityInStock: 100, imageUrl: "https://placehold.co/600x400?text=Rasgulla" },
  { name: "Jalebi", category: "Indian", description: "Crispy spirals soaked in saffron syrup.", price: 15, quantityInStock: 80, imageUrl: "https://placehold.co/600x400?text=Jalebi" },
  { name: "Kaju Katli", category: "Indian", description: "Diamond-shaped cashew fudge with silver leaf.", price: 45, quantityInStock: 60, imageUrl: "https://placehold.co/600x400?text=Kaju+Katli" },
  { name: "Motichoor Ladoo", category: "Indian", description: "Fine boondi ladoos flavored with cardamom.", price: 25, quantityInStock: 90, imageUrl: "https://placehold.co/600x400?text=Motichoor+Ladoo" },
  { name: "Peda", category: "Indian", description: "Milk-based soft sweet, often flavored with saffron.", price: 22, quantityInStock: 70, imageUrl: "https://placehold.co/600x400?text=Peda" },
  { name: "Barfi", category: "Indian", description: "Dense milk fudge in assorted flavors.", price: 30, quantityInStock: 75, imageUrl: "https://placehold.co/600x400?text=Barfi" },
  { name: "Soan Papdi", category: "Indian", description: "Flaky, melt-in-mouth gram flour sweet.", price: 35, quantityInStock: 50, imageUrl: "https://placehold.co/600x400?text=Soan+Papdi" },

  // Chocolate
  { name: "Dark Chocolate Truffle", category: "Chocolate", description: "Rich 70% dark chocolate ganache truffle.", price: 60, quantityInStock: 40, imageUrl: "https://placehold.co/600x400?text=Dark+Truffle" },
  { name: "Milk Chocolate Bar", category: "Chocolate", description: "Creamy milk chocolate bar.", price: 50, quantityInStock: 100, imageUrl: "https://placehold.co/600x400?text=Milk+Chocolate" },
  { name: "White Chocolate Fudge", category: "Chocolate", description: "Smooth white chocolate fudge squares.", price: 55, quantityInStock: 45, imageUrl: "https://placehold.co/600x400?text=White+Fudge" },
  { name: "Chocolate Brownie", category: "Chocolate", description: "Fudgy chocolate brownie with walnuts.", price: 40, quantityInStock: 60, imageUrl: "https://placehold.co/600x400?text=Brownie" },

  // Candy
  { name: "Gummy Bears", category: "Candy", description: "Fruity gummy bears in assorted flavors.", price: 12, quantityInStock: 200, imageUrl: "https://placehold.co/600x400?text=Gummy+Bears" },
  { name: "Lollipop", category: "Candy", description: "Classic hard candy lollipop.", price: 8, quantityInStock: 300, imageUrl: "https://placehold.co/600x400?text=Lollipop" },
  { name: "Caramel Toffee", category: "Candy", description: "Chewy caramel toffee pieces.", price: 10, quantityInStock: 150, imageUrl: "https://placehold.co/600x400?text=Caramel+Toffee" },
  { name: "Sour Worms", category: "Candy", description: "Tangy sour gummy worms.", price: 14, quantityInStock: 180, imageUrl: "https://placehold.co/600x400?text=Sour+Worms" },

  // Bakery
  { name: "Red Velvet Cupcake", category: "Bakery", description: "Red velvet cupcake with cream cheese frosting.", price: 35, quantityInStock: 50, imageUrl: "https://placehold.co/600x400?text=Red+Velvet" },
  { name: "Cheesecake Slice", category: "Bakery", description: "New York style cheesecake slice.", price: 65, quantityInStock: 30, imageUrl: "https://placehold.co/600x400?text=Cheesecake" },
  { name: "Croissant", category: "Bakery", description: "Buttery flaky French croissant.", price: 28, quantityInStock: 40, imageUrl: "https://placehold.co/600x400?text=Croissant" },
  { name: "Macaron (Assorted)", category: "Bakery", description: "French macarons in assorted flavors.", price: 20, quantityInStock: 60, imageUrl: "https://placehold.co/600x400?text=Macaron" },

  // Dry Fruits
  { name: "Almond Halwa", category: "Dry Fruits", description: "Rich almond halwa with ghee.", price: 50, quantityInStock: 35, imageUrl: "https://placehold.co/600x400?text=Almond+Halwa" },
  { name: "Pistachio Roll", category: "Dry Fruits", description: "Pistachio and khoya roll.", price: 48, quantityInStock: 40, imageUrl: "https://placehold.co/600x400?text=Pistachio+Roll" },
  { name: "Date & Nut Bar", category: "Dry Fruits", description: "Healthy date and mixed nut bar.", price: 32, quantityInStock: 55, imageUrl: "https://placehold.co/600x400?text=Date+Nut+Bar" },

  // International
  { name: "Baklava", category: "International", description: "Layered phyllo pastry with nuts and honey.", price: 70, quantityInStock: 25, imageUrl: "https://placehold.co/600x400?text=Baklava" },
  { name: "Turkish Delight", category: "International", description: "Chewy lokum in rose and lemon flavors.", price: 42, quantityInStock: 40, imageUrl: "https://placehold.co/600x400?text=Turkish+Delight" },
  { name: "Churros", category: "International", description: "Fried dough sticks with chocolate dip.", price: 30, quantityInStock: 45, imageUrl: "https://placehold.co/600x400?text=Churros" },
  { name: "Mochi", category: "International", description: "Japanese rice cake with sweet filling.", price: 26, quantityInStock: 50, imageUrl: "https://placehold.co/600x400?text=Mochi" },
  { name: "Gelato (Vanilla)", category: "International", description: "Italian gelato, vanilla bean.", price: 38, quantityInStock: 30, imageUrl: "https://placehold.co/600x400?text=Gelato" },

  // Festival Special
  { name: "Modak", category: "Festival Special", description: "Steamed modak with coconut-jaggery filling.", price: 24, quantityInStock: 60, imageUrl: "https://placehold.co/600x400?text=Modak" },
  { name: "Gujiya", category: "Festival Special", description: "Fried pastry with khoya and nuts.", price: 27, quantityInStock: 55, imageUrl: "https://placehold.co/600x400?text=Gujiya" },
  { name: "Puran Poli", category: "Festival Special", description: "Sweet flatbread with lentil-jaggery filling.", price: 20, quantityInStock: 40, imageUrl: "https://placehold.co/600x400?text=Puran+Poli" },
  { name: "Sheer Khurma", category: "Festival Special", description: "Festive vermicelli pudding with dates.", price: 33, quantityInStock: 35, imageUrl: "https://placehold.co/600x400?text=Sheer+Khurma" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  for (const s of sweets) {
    const payload = {
      ...s,
      images: s.images || (s.imageUrl ? [s.imageUrl] : []),
    };
    await Sweet.findOneAndUpdate(
      { name: s.name },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${sweets.length} sweets`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});