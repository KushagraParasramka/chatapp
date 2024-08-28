import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Message } from "../models/message.model.js"
import { Chat } from "../models/chat.model.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler( async (req,res) => {
    try {
    const message = req.body;
    const chat = await Chat.findById(message.chatid);

    if(!chat) {
        throw new ApiError(500,"chat does not exist")
    }


    const newMessage = await Message.create({
        text: message.text,
        chatid: message.chatid,
        sender: req.user.username
    })

    chat.messageids.push(newMessage._id);
    const updatedChat = await chat.save();


    await User.updateMany(
        {
            username: { $in: updatedChat.usernames, $ne: req.user.username },
            "chatids.chatId": message.chatid
        },
        { $inc: { "chatids.$.messageCount": 1 } }
    );


    const newData = {
        ...newMessage,
        sendername: req.user.username,
        users: updatedChat.usernames
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,newData,"message sent successfully")
    )

    } catch (err) {
        throw new ApiError(500,"can not send message. Some technical problem")
    }

})

export {
    sendMessage
}
