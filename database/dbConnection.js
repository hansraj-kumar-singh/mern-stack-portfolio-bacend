import mongoose from "mongoose";

const dbConnection = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "PORTFOLIO",
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log(`some error occurred while connecting to database: ${err}`);
    });
  }    


export default dbConnection;