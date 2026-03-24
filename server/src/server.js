const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDb = require("./config/db");
const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const bootstrapDemoData = require("./data/bootstrap");

const app = express();

app.use(
  cors({
    origin: [env.clientUrl, env.adminUrl].filter(Boolean)
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", routes);
app.use(errorHandler);

connectDb()
  .then(async () => {
    await bootstrapDemoData();
    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to MongoDB", error);
    process.exit(1);
  });
