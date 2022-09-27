import Chat from "../models/chatmodel.js";
import Message from "../models/messagemodel.js";
import User from "../models/usermodel.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid Data");
    res.status(400);
  }
//   console.log(req.user.id, chatId);
  var newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };
//   console.log(newMessage)

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chats.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
    latestMessage:message,
    });
    res.json(message);
  } catch (error) {
    res.send(error.message);
  }
};

export const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.send(error.message);
  }
};
