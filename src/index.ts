import express from "express";
import userRoutes from "./routes/userRoute";
import productRoutes from "./routes/productRoutes";
import contactRoutes from "./routes/contactRoutes";
import bannerRoutes from "./routes/campaignRoutes";
import connectDB from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/banners", bannerRoutes);
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
