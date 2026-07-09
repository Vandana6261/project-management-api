import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";
import connectMongo from "./config/mongo.js";

const startServer = async () => {
  try {
    await Promise.all([
        prisma.$connect(),
        connectMongo()
    ]);
    console.log("Both DB Connected");


    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server running on Port: ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
