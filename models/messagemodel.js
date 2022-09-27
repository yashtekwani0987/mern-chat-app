import mongoose from "mongoose";
const {Schema} = mongoose

const messageSchema = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chat'
    }
},{timestamps:true})

const Message = mongoose.model('message', messageSchema ,)
export default Message