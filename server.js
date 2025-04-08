const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const fileUpload = require("express-fileupload");
app.use(cookieParser());
require("dotenv").config();
const cors = require("cors");

const DbConnect = require("./config/database");
DbConnect();

const cloudinaryConnect = require("./config/cloudinary");
cloudinaryConnect();

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const routes = require("./routes/routes");
app.use("/api/v1", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`your server started at portNo ${PORT}`);
});
