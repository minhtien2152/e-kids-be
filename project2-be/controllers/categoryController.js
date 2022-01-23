const category = require('../models/categoryModel');
const base = require('./baseController');



exports.updateCategory = base.updateOne(category);
exports.deleteCategory = base.deleteOne(category);
exports.createCategory = base.createOne(category);
exports.getAll = base.getAll(category)
exports.getOne = base.getOne(category)
