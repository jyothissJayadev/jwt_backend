import mongoose from 'mongoose';

export const User=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide unique UserName"],
        unique:[true,"name Exist"]
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        unique:false
    },
    email:{
        type:String,
        required:[true,"please provide a nique email"],
        unique:true,
    },
   

})

export default mongoose.model('User',User)