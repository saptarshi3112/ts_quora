import {
  Schema,
  model,
  Model
} from 'mongoose';

const userSchema: Schema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  profile_image: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  date_joined: {
    type: Date,
    default: new Date()
  }
});

export const User: Model<any> = model('user', userSchema);
