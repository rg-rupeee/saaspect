const Edible = require("./../model/edibleModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.fetchEdible = catchAsync(async (req, res, next) => {
  const edibles = await Edible.find({ quantity: { $gt: 0 } });

  return res.status(200).json({
    status: "success",
    noEdibles: edibles.length,
    edibles,
  });
});

exports.createEdible = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const edible = await Edible.create(req.body);

  return res.status(201).json({
    status: "success",
    edible,
  });
});

exports.updateEdibleQuantity = catchAsync(async (req, res, next) => {
  const edible = await Edible.findByIdAndUpdate(
    req.params.id,
    {
      quantity: req.body.quantity,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!edible) {
    return next(new AppError("No edible found with that ID", 404));
  }

  return res.json({
    status: "success",
    edible,
  });
});
