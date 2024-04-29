import mongoose from "mongoose";

const connectToMongoDB = async () => {  
    try {
        const connectionInstance = await mongoose.connect(
          process.env.MONGODB_URI
        );
    
        console.log(`Connected to MongoDB ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};

export default connectToMongoDB;