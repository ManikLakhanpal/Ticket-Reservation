import Movie from "../models/movieSchema.js";
import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import auth from "../middleware/auth.js";
import Order from "../models/order.js";
import sendBookingConfirmation from "../controllers/emailController.js";

const router = Router();

router.post("/pay", auth, async (req, res) => {
  try {
    const { movieTitle } = req.body;

    // ? Amount in peise here
    const amount = req.body.amount * 100; 
    const { email } = req.user;

    // * Check if email and movieName are there
    if (!email || !movieTitle) {
      return res
        .status(400)
        .json({ message: "Email and movieTitle are required." });
    }

    // * Check if movie exists in the db
    const movie = Movie.findOne({title: movieTitle});
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    var razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    console.log(req.body);

    const options = {
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise (500INR)
      currency: "INR", // Currency you want to accept payments in
      receipt: `BookID#${Date.now()}`, // A unique receipt number
    };
    const order = await razorpay.orders.create(options); // Creates a new order

    if (!order) {
      return res.status(500).send("Error"); // If order creation fails
    }

    console.log(order);

    res.json(order); // Returns the order details
  } catch (err) {
    console.log(err);

    res.status(500).send("Error");
  }
});

router.post("/payment-success-status", auth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    movieTitle,
    price,
  } = req.body;

  const { uid, email } = req.user;
  const movieData = Movie.findOne({title: movieTitle});

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id); // Concatenating order_id and payment_id
  const generatedSignature = hmac.digest("hex"); // Hashing the string using SHA256 algorithm and converting it to hexadecimal format

  if (generatedSignature === razorpay_signature) {
    // Comparing the generated signature with the signature sent by RazorPay
    // Payment is verified
    const newOrder = new Order({ uid, movieName: movieTitle, amount: price });
    await newOrder.save();

    sendBookingConfirmation(email, movieData);

    res.send({ success: true, message: "Payment verified successfully!" }); // Sending a success response
  } else {
    // Payment verification failed
    res
      .status(400)
      .send({ success: false, message: "Payment verification failed." }); // Sending a failure response
  }
});

export default router;
