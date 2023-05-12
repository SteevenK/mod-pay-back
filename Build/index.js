"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentRequestsSchema = require("./models/paymentRequestSchema");
const express_1 = __importDefault(require("express"));
const PORT = 5000;
const mongoURL = "mongodb+srv://admin:123Admin456@paymentdbtest.qubrpxb.mongodb.net/paymentRequests";
const app = (0, express_1.default)();
const cors = require("cors");
const mongoose_1 = __importDefault(require("mongoose"));
app.use(cors());
app.use(express_1.default.json());
const PaymentRequestsModel = mongoose_1.default.model("PaymentRequests", PaymentRequestsSchema.schema);
mongoose_1.default
    .connect(mongoURL)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.log(error);
});
const conn = mongoose_1.default.createConnection();
conn.collection("PaymentRequestsCollection");
app.post("/DB", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body !== null) {
        const newPaymentRequest = new PaymentRequestsModel({
            email: req.body.email,
            amount: req.body.amount,
            cardNumber: req.body.cardNumber,
            cvc: req.body.cvc,
            expirationDate: req.body.expirationDate,
            name: req.body.name,
        }); // Assign req.body values to the document
        //console.log(newPaymentRequest);
        newPaymentRequest
            .save()
            .then((result) => {
            console.log("New account saved successfully:", result);
            res.status(201).json(result);
        })
            .catch((error) => {
            console.error("Error saving payment request:", error);
            res.status(500).json({
                error: "An error occurred while saving the payment request",
            });
        });
    }
    else {
        res.status(400).json({ error: "Please provide all the required fields" });
    }
}));
app.get("/DB/findByCardNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    PaymentRequestsModel.find({ cardNumber: req.body.cardNumber })
        .exec()
        .then((result) => {
        res.send(result);
    })
        .catch((error) => {
        console.log(error);
    });
}));
app.put("/DB/findByCardNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account2Update = yield PaymentRequestsModel.findOne({
            cardNumber: req.body.cardNumber,
        }).exec();
        if (!account2Update) {
            return res.status(404).json({ message: "Account not found" });
        }
        if ((account2Update.amount -= req.body.amount) >= 0) {
            yield account2Update.save();
        }
        else {
            return res.status(400).json({ message: "Insufficient Balance" });
        }
        res.status(200).json({ message: "Account Balance Updated" });
        console.log("Account Balance Updated");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
