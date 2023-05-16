// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require("mongoose");

const PaymentRequestsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter a valid email address"],
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  cvc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});

const PaymentRequestsModel = mongoose.model(
  "PaymentRequests",
  PaymentRequestsSchema
);

module.exports = PaymentRequestsModel;

module.exports.schema = PaymentRequestsSchema;
