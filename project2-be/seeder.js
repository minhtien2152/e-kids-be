const Category = require("./models/categoryModel");
const Word = require("./models/wordModel");
const connectDB = require("./utils/connectDB");
const categories = require("./data/category.json");
const words = require("./data/word.json");
connectDB();

const importData = async () => {
  try {
    //await Category.deleteMany();
    //await Category.insertMany(categories);
    await Word.deleteMany();
    await Word.insertMany(words);
    console.log("Data imported!");
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
