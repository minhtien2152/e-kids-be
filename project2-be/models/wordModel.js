const mongoose = require("mongoose");

const wordSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  meaning: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
