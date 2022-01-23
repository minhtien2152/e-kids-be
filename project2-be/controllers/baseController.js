const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

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
      data: null,
      message: "deleted one document",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);

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

exports.getAll = (Model) => async (req, res, next) => {
  try {
    const { limit, sort, page, populate, keyword, ...rest } = req.query;

    const sortAndPaginate = { limit, sort, page };
    let features;
    let totalCount = 0;
    if (keyword) {
      features = new APIFeatures(
        Model.find({ ...rest, $text: { $search: `\"${keyword}\"` } }).populate(
          populate
        ),
        sortAndPaginate
      )
        .sort()
        .paginate();
      totalCount = await Model.find({
        ...rest,
        $text: { $search: `\"${keyword}\"` },
      });
    } else {
      features = new APIFeatures(
        Model.find({ ...rest }).populate(populate),
        sortAndPaginate
      )
        .sort()
        .paginate();
      totalCount = await Model.find({ ...rest });
    }

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      total: totalCount.length,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};
