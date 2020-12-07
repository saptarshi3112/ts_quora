export interface LoginAuthenticationSchema {
  _id: string;
  user_id: string;
  last_logged_in: Date;
  last_logged_out: Date;
  is_logged: boolean;
}
