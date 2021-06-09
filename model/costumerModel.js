const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const purchaseSchema = new mongoose.Schema(
  {
    edible_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Edible",
      required: true,
    },
    quantityPurchsed: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const costumerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "A costumer must provide an email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please create a password"],
  },
  purchases: [purchaseSchema],
});

// encrypting user password before saving to database
costumerSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

const Costumer = mongoose.model("Costumer", costumerSchema);
module.exports = Costumer;
