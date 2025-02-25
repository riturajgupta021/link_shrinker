import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    urls: {
        type: [Schema.Types.ObjectId],
        ref:"url"
    }
});

const User = model("user", userSchema);

export { User };