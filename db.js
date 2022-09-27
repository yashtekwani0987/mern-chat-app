import mongoose from "mongoose";

const URL = 'mongodb://localhost:27017/chatapp'

const connectMongo = ()=>{  mongoose.connect(URL , ()=>{
    console.log('connect To Mongo')
})}

export default connectMongo