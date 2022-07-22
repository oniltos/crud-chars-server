import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/user.router.js";
import { charRouter } from "./src/routes/char.router.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(charRouter);

app.listen(port, () => console.log(`Server up and running at port ${port}`));
