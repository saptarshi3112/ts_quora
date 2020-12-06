import { Schema, model, Model } from 'mongoose';

const questionSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: new Date()
  },
  is_anonymous: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'tags'
  }]
});

export const Question: Model<any> = model('question', questionSchema);
