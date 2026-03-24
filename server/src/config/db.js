const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const env = require("./env");

let memoryServer;

async function connectDb() {
  mongoose.set("strictQuery", true);

  if (env.useMemoryDb) {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "golf-charity"
      }
    });
    await mongoose.connect(memoryServer.getUri());
    console.log("MongoDB connected (memory server)");
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
}

module.exports = connectDb;
