const Costumer = require("./../model/costumerModel");
const Edible = require("./../model/edibleModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.purchaseEdible = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const { id, quantity } = req.body;

  if (!id || !quantity) {
    return next(new AppError("please provide edible id and quantity", 400));
  }

  // find edible with id
  const edible = await Edible.findById(id);

  // if edible not found return error
  if (!edible) {
    return next(new AppError("No edible found with that id", 400));
  }

  // check if given quatity is less than or equal to available quantity else return error
  if (edible.quantity < quantity) {
    return next(
      new AppError(
        `Available Edible stock is less than required. Available quantity : ${edible.quantity}`,
        400
      )
    );
  }

  // add purchase to costumer Document
  const updatedPurchase = await Costumer.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        purchases: {
          edible_id: edible._id,
          quantityPurchsed: quantity,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // decrease quantity in edible
  const updatedQuantity = edible.quantity - quantity;
  const updatedEdible = await Edible.findOneAndUpdate(
    { _id: edible._id },
    {
      quantity: updatedQuantity,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // create bill
  const bill = quantity * parseInt(edible.price);

  // return response
  return res.json({
    status: "success",
    bill: `RS ${bill}`,
    user: req.user.email,
    userPurchases: updatedPurchase.purchases,
    updatedEdible,
  });
});

exports.checkPurchase = catchAsync(async (req, res, next) => {
  const edibleId = req.params.edibleId;

  const costumer = await Costumer.findOne({ _id: req.user._id });

  const purchases = costumer.purchases;

  let isPurchased = false;

  // check if the edible with id edibleId was purchased
  let i;
  for(i=0; i<purchases.length; i++){
    if(purchases[i].edible_id == edibleId){
      isPurchased = true;
      break;
    }
  }

  let message;
  if (isPurchased) {
    message = `edible with id: ${edibleId} was purchased`;
  } else {
    message = `edible with id: ${edibleId} was not purchased`;
  }

  return res.status(200).json({
    status: "success",
    isPurchased,
    message,
    costumer: req.user.email,
  });
});
