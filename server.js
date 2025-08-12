const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.LOCAL_HOST_1, process.env.LOCAL_HOST_2],
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.LOCAL_HOST_1, process.env.LOCAL_HOST_2],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    //useNewUrlParser: true,
   //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// const PORT = process.env.PORT;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });