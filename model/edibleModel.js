const mongoose = require("mongoose");

const edibleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 100,
      required: [true, "An edible must have a name"],
    },
    type: {
      type: String,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "An edible must have a price"],
    },
    quantity: {
      type: Number,
      required: [true, "An edible must have a quantity"],
    },
  },
  {
    timestamps: true,
  }
);

const Edible = mongoose.model("Edible", edibleSchema);
module.exports = Edible;
