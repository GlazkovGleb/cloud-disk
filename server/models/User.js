import { Schema, model, ObjectId } from "mongoose";


const User = new Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    date: { type: Date, default: Date.now() },
    avatar: {type: String},
    files: [{type: ObjectId, ref: 'File'}]
})

export default model('User', User)