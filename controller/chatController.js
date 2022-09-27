import Chat from "../models/chatmodel.js";
import User from "../models/usermodel.js";

export const createchat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.send("Not Found");
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };
  }
  try {
    const createdchat = await Chat.create(chatData);
    const Fullchat = await Chat.findOne({ id: createdchat.id }).populate(
      "users",
      "-password"
    );
    // res.json(Fullchat);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

export const fetchchat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.send(results);
      });
  } catch (error) {
    res.send(error.message);
  }
};

export const groupchat = async (req , res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("fill the fields");
  }
  var users = req.body.users;
  if (users.length < 2) {
    res.status(400).send("More than 2 users are required");
  }
  users.push(req.user.id);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

   
    const fullgroupChat = await Chat.findOne({ _id: groupChat.id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(fullgroupChat);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
};

export const renamegroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!updatedChat){
      res.status(400).send('Error')

    }
    else{
      res.json(updatedChat)
    }
};

export const addgroup = async(req,res)=>{
  const {chatId , userId}=req.body
  // console.log(chatId , userId)
  const added = await Chat.findByIdAndUpdate(chatId,
    {$push:{users:userId}
  },{new:true}
  ).populate("users", "-password")
  .populate("groupAdmin", "-password");

  if(!added){
    res.status(404).send('error')
  }
  else{
    res.json(added)
  }
   
}


export const removegroup = async(req,res)=>{
  const {chatId , userId}=req.body
  try {
    
    const remove = await Chat.findByIdAndUpdate(
      chatId,
      {$pull:{users:userId}
    },{new:true}
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");
    
    if(!remove){
      res.status(404).send('error')
    }
    else{
      res.json(remove)
    }
  } catch (error) {
   console.log(error.message)
   res.send(error.message) 
  }
   
}