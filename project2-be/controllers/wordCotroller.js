const word = require("../models/wordModel");
const base = require("./baseController");

exports.updateWord = base.updateOne(word);
exports.deleteWord = base.deleteOne(word);
exports.createWord = base.createOne(word);
exports.getAll = base.getAll(word);
exports.getOne = base.getOne(word);
