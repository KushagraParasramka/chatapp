import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema(
    {
        chatname: {
            type: String,
            lowercase: true,
            trim: true,
        },
        usernames : [{
            type: String
        }],
        messageids : [{
            type: Schema.Types.ObjectId,
            ref: "Message"
        }],
        isgroup: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true
    }
)


export const Chat = mongoose.model("Chat", chatSchema)
