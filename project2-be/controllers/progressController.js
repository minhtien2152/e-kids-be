const Progress = require("../models/progressModel");
const base = require("./baseController");

exports.updateProgress = async (req, res, next) => {
  try {
    const doc = await Progress.find({ user: req.params.id });
    if (doc.length) {
      await Progress.updateOne(
        { user: req.params.id, wordList: { $nin: [req.params.idword] } },
        { $push: { wordList: [req.params.idword] } }
      );
      console.log("update");
    } else
      await Progress.create({
        user: req.params.id,
        wordList: [req.params.idword],
      });

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const doc = await Progress.find({ user: req.params.id });
    if (!doc) {
      return next(
        new AppError(404, "fail", "No document found with that id"),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};
