import { Schema, model, Model } from 'mongoose';

const tagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

export const Tag: Model<any> = model('tag', tagSchema);
