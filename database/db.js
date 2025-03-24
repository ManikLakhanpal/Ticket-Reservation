import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "ticketReservation", // Define the database name separately
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected to TicketReservation");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
