const dotenv = require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const campusRoute = require("./routes/campusRoute");
const facultyRoute = require("./routes/facultyRoute");
const departmentRoute = require("./routes/departmentRoute");
const studentRoute = require("./routes/sutdentRoute");
const lecturerRoute = require("./routes/lecturerRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const bankRoute = require("./routes/bankRoute");
const path = require("path");

const userRoute = require("./routes/userRoute");

const app = express();
//Middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://unicross-forum.onrender.com"],
    credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
 
//Routes middleware
app.use("/api/portal", userRoute);
app.use("/api/campus", campusRoute);
app.use("/api/faculty", facultyRoute);
app.use("/api/department", departmentRoute);
app.use("/api/student", studentRoute);
app.use("/api/lecturer", lecturerRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/bank", bankRoute);

//Routes
app.get("/", (req, res, next) => {
    res.send("Backend Connected");
});
//Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

//Connnect to Db and Start Server 
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.log(err);
})