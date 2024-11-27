import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true // Ensure email is indexed
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add middleware to handle unique email validation
userSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoError' || error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'));
  } else {
    next(error);
  }
});

// Drop existing model if it exists to ensure clean state
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const UserModel = mongoose.model<IUser>('User', userSchema);
