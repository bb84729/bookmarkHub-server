import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  createdAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 儲存之前，自動加密密碼
UserSchema.pre('save', async function (this: IUser) {
  // 如果密碼沒有被修改，就跳過
  if (!this.isModified('password')) {
    return
  }

  // 加密密碼
  const saltRounds = 10
  this.password = await bcrypt.hash(this.password, saltRounds)
})

// 比對密碼的方法
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>('User', UserSchema)
