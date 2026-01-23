import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IFolder extends Document {
  name: string
  user: Types.ObjectId
  createdAt: Date
}

const FolderSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Folder name is required'],
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<IFolder>('Folder', FolderSchema)
