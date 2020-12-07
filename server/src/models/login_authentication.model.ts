import { model, Model, Schema } from 'mongoose';

const loginAuthenticationSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  last_logged_out: {
    type: Date,
    default: new Date()
  },
  last_logged_in: {
    type: Date,
    default: new Date()
  },
  is_logged: {
    type: Boolean,
    default: false
  }
});

export const LoginAuthentication: Model<any> = model('login_authentication', loginAuthenticationSchema);
