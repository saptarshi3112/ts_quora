import {
  Model,
  model,
  Schema
} from 'mongoose';

const AuthenticationSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  authenticated: {
    type: Boolean,
    default: false
  }
});

export const Authentication: Model<any> = model('authentication', AuthenticationSchema);
