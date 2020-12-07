import { Schema, model, Model } from 'mongoose';

const tagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'question'
  }]
});

export const Tag: Model<any> = model('tag', tagSchema);
