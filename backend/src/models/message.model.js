import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },
        chatid : {
            type: Schema.Types.ObjectId,
            ref: "Chat"
        },
        sender : {
            type: String
        },

    },
    {
        timestamps: true
    }
)


export const Message = mongoose.model("Message", messageSchema)
