import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Chat } from "../models/chat.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const chatAccess = asyncHandler(async (req,res) => {
    try {
        const chatId = req.body.chatId;
        if ( !chatId ) {
            throw new ApiError(401,"no chat id");
        }
        const chatData = await Chat.findById(chatId).populate("messageids");
        if (!chatData) {
            throw new ApiError(402,"no chat data for the id... Invalid chat id... chat does not exist");
        }

        if (!chatData.usernames.includes(req.user.username)) {
            throw new ApiError(403, "You are not part of this chat.");
        }

        if (!chatData.isgroup) {
            const otherUsername = chatData.usernames.find(username => username !== req.user.username);
            chatData.chatname = otherUsername;
        }
        await User.updateOne(
            { _id: req.user._id, "chatids.chatId": chatId },
            { $set: { "chatids.$.messageCount": 0 } }
        );


        return res
    .status(200)
    .json(new ApiResponse(
        200,
        chatData,
        "chat found successfully"
    ))
    } catch (err) {
        throw new ApiError(401, err?.message || "Something wrong in chat access function")
    }

})

const requestFriend = asyncHandler(async (req,res) => {
    try {
        const { username } = req.body;
        const userId = req.user._id;
        const myUsername = req.user.username;

        if(!username) {
            throw new ApiError(401,"empty friend request")
        }
        if(myUsername === username) {
            throw new ApiError(401,"you can not send request to yourself");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { requested: username } },
            { new: true }
        );

        if (!user) {
            throw new ApiError(404, "User not found.");
        }


        const otherUser = await User.findOneAndUpdate(
            { username: username },
            { $addToSet: { requestedby: myUsername } },
            { new: true }
        );

        if (!otherUser) {
            throw new ApiError(404, "The user you are trying to request was not found.");
        }

        return res.status(200).json(new ApiResponse(
            200,
            { user: user.username, otheruser: otherUser.username },
            `Friend request sent successfully to ${username}.`
        ));
    } catch (err) {
        throw new ApiError(500, err?.message || "An error occurred while sending the friend request.");
    }
})

const addFriend = asyncHandler( async (req,res) => {
    try {
        const accept = req.body.accept;
        const otherUsername = req.body.username;
        const userId = req.user._id;
        const myUsername = req.user.username;

        if (!otherUsername) {
            throw new ApiError(401, "empty response");
        }

        if (req.user.friends.includes(otherUsername)) {
            throw new ApiError(500, "Already your friend");
        }
        if (!req.user.requestedby.includes(otherUsername)) {
            throw new ApiError(401, "He/she did not send you a friend request :/");
        }

        let otherUser, user, newChat;

        if (accept) {
            newChat = await Chat.create({
                chatname: "",
                usernames: [myUsername, otherUsername]
            });

            otherUser = await User.findOneAndUpdate(
                { username: otherUsername },
                {
                    $pull: { requested: myUsername },
                    $addToSet: { friends: myUsername },
                    $push: {
                        chatids: {
                            chatId: newChat._id,
                            messageCount: 0
                        }
                    }
                },
                { new: true }
            );

            user = await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { requestedby: otherUsername },
                    $addToSet: { friends: otherUsername },
                    $push: {
                        chatids: {
                            chatId: newChat._id,
                            messageCount: 0
                        }
                    }
                },
                { new: true }
            );
        } else {
            otherUser = await User.findOneAndUpdate(
                { username: otherUsername },
                { $pull: { requested: myUsername } },
                { new: true }
            );

            user = await User.findByIdAndUpdate(
                userId,
                { $pull: { requestedby: otherUsername } },
                { new: true }
            );
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { user: user.username, otheruser: otherUser.username, newChat:newChat },
                "Response to request is successful :)"
            ));
    } catch (err) {
        throw new ApiError(500, err?.message || "An error occurred while responding to the friend request.");
    }
});

const searchUser = asyncHandler(async (req,res) => {
    try {
        const val = req.body.val;

        const users = await User.find({ username: { $regex: val, $options: "i" } }).select('username');

        if (!users.length) {
            throw new ApiError(404, "No users found with the given substring.");
        }

        return res.status(200).json(new ApiResponse(
            200,
            users,
            "Usernames found successfully."
        ));
    } catch (err) {
        throw new ApiError(500, err?.message || "An error occurred while searching for usernames.");
    }

})

const allChats = asyncHandler(async (req, res) => {
    try {
        // Populate the chatId field inside chatids
        const user = await User.findById(req.user._id).populate("chatids.chatId");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Map over chatids and prepare the chat data
        const allChats = user.chatids.map((chatData) => {
            const chat = chatData.chatId.toObject(); // Convert Mongoose document to plain object

            if (!chat.isgroup) {
                const otherUsername = chat.usernames.find(username => username !== req.user.username);
                chat.chatname = otherUsername;
            }

            return {
                _id: chat._id,
                chatname: chat.chatname,
                usernames: chat.usernames,
                messageCount: chatData.messageCount,
                isgroup: chat.isgroup,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            };
        });

        return res.status(200).json({
            status: 200,
            data: allChats,
            message: "All chats loaded successfully"
        });
    } catch (err) {
        throw new ApiError(500, "Can't load the chats");
    }
});


export {
    chatAccess,
    requestFriend,
    addFriend,
    searchUser,
    allChats
}
