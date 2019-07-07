import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  /**
   * method to create a new session
   * verify id user exists
   * get verification of password
   * return token and login user
   */
  async store(req, res) {
    const { email, password } = req.body;
    // verify if user exists
    const user = await User.findOne({ where: { email }});
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // get checkPassword from User.js, if password does not match return a error
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // if all is ok, return user and login's token
    const { id, name } = user;
    return res.json({
      user: { id, name, email },
      // sign token
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      }),
    });

  }
}

export default new SessionController();
