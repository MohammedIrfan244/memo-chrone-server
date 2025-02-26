import mongoose from "mongoose";
import { logError,logInfo } from "../lib/utils/logger";

const mongoConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI+"memoDB");
        logInfo("Connected to MongoDB");
    }catch(err){
        logError("Failed to connect to MongoDB");
    }
};

export default mongoConfig;