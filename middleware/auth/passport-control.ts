import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import { findUserByEmail } from '../../services/user-service'

export interface UserI {
  email: string,
  password: string,
}

passport.use(new Strategy({ usernameField: 'email' },
  async (email, password, callback) => {
    if (!email && !password) {
      callback(null, null)
      return;
    }

    try {
      const user = await findUserByEmail(email);
      if (user === null) {
        callback(null, null);
        return;
      }
      
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        callback(null, user)
        return;
      }
    } catch (e) {
      callback(e);
    }

    callback(null, null)
  }));

  export default passport;