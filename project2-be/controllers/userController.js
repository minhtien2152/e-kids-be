const User = require("../models/userModel");
const base = require("./baseController");

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

// Don't update password on this
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);

exports.addFav = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.params.id, fav_list: { $nin: [req.params.idword] } },
      { $push: { fav_list: [req.params.idword] } }
    );

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
