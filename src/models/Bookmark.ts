import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IBookmark extends Document {
  title: string
  url: string
  description?: string
  favicon?: string
  tags: string[]
  folder?: Types.ObjectId
  user: Types.ObjectId
  createdAt: Date
}

const BookmarkSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  favicon: {
    type: String
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  folder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder'
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

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema)
