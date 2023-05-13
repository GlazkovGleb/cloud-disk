import { Schema, model, ObjectId } from "mongoose";


const File = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    accessLink: { type: String },
    size: { type: Number, default: 0 },
    path: { type: String },
    date: { type: Date, default: Date.now() },
    user: { type: ObjectId, ref: 'User' },
    parent: { type: ObjectId, ref: 'File' },
    childs: [{ type: ObjectId, ref: 'File' }],
})

File.methods.sizeDir = async function (file, user, regexp) {
    if (file.type === 'dir' && file.childs.length !== 0) {
        const childs = await this.model('File').find({ user: user, path: regexp })
        this.size = childs.reduce((total, child) => total + child.size, 0)
        await this.save()
    }
}
export default model('File', File)