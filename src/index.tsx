import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const PORT = 5000;
const mongoURL =
  "mongodb+srv://admin:123Admin456@paymentdbtest.qubrpxb.mongodb.net/paymentRequests";
const app = express();
app.use(cors());
app.use(express.json());

const PaymentRequestsModel = mongoose.model(
  "PaymentRequests",
  PaymentRequestsSchema.schema
);

mongoose
  .connect(mongoURL)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });

const conn = mongoose.createConnection();
conn.collection("PaymentRequestsCollection");

app.post("/DB", async (req: express.Request, res: express.Response) => {
  if (req.body !== null) {
    const newPaymentRequest = new PaymentRequestsModel({
      email: req.body.email,
      amount: req.body.amount,
      cardNumber: req.body.cardNumber,
      cvc: req.body.cvc,
      expirationDate: req.body.expirationDate,
      name: req.body.name,
    }); // Assign req.body values to the document
    // console.log(newPaymentRequest);
    newPaymentRequest
      .save()
      .then((result: any) => {
        // eslint-disable-next-line no-console
        console.log("New account saved successfully:", result);
        res.status(201).json(result);
      })
      .catch((error: Error) => {
        // eslint-disable-next-line no-console
        console.error("Error saving payment request:", error);
        res.status(500).json({
          error: "An error occurred while saving the payment request",
        });
      });
  } else {
    res.status(400).json({ error: "Please provide all the required fields" });
  }
});

app.get(
  "/DB/findByCardNumber",
  async (req: express.Request, res: express.Response) => {
    PaymentRequestsModel.find({ cardNumber: req.body.cardNumber })
      .exec()
      .then((result: any) => {
        res.send(result);
      })
      .catch((error: Error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }
);

app.put(
  "/DB/findByCardNumber",
  async (req: express.Request, res: express.Response) => {
    try {
      const account2Update = await PaymentRequestsModel.findOne({
        cardNumber: req.body.cardNumber,
      }).exec();
      if (!account2Update) {
        return res.status(404).json({ message: "Account not found" });
      }
      const UpdatedAmount: number = account2Update.amount - req.body.amount;
      if (UpdatedAmount >= 0) {
        await account2Update.save();
      } else {
        return res.status(400).json({ message: "Insufficient Balance" });
      }
      // eslint-disable-next-line no-console
      console.log("Account Balance Updated");
      return res.status(200).json({ message: "Account Balance Updated" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);
