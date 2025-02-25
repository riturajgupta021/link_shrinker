import { connect } from "mongoose";
import "dotenv/config";
import { Url } from "./models/url.model.js";

const DB_URL = process.env.DB_URL;

async function connectToDatabase() {
    try {
        await connect(DB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
    }
}

export { connectToDatabase };