const express = require("express");
const connectDB = require("./config/dbConnection");

//Importing Routes Variables
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const reviewRoute = require("./routes/review");
const porfileRoute = require("./routes/profile");

const app = express();

//Express Bodyparser Middleware
app.use(express.json({ extended: false }));

//Connecting with Mongodb Atlas
connectDB();
//Redirecting Application to Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/review", reviewRoute);
app.use("/api/profile", porfileRoute);

//Listening to the Server
app.listen(3000, () => console.log("Node Server Up At Port 3000"));
