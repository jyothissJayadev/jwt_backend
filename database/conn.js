import mongoose from "mongoose";
const mongoDb="mongodb+srv://jyothiss:jjkvj%40123JJ@cluster0.twwyjz8.mongodb.net/jwt_Verify";
const connectDb=async()=>{
   
      
       const db=await mongoose.connect(mongoDb)
       console.log("connection establoished" ,db.connection.host)
 return db
 
      
};

export default connectDb