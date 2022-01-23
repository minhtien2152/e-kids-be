const mongoose = require("mongoose");

const progressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  wordList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
    },
  ],
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
