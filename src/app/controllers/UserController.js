import User from '../models/User';

class UserController {
  /**
   * method to store a new user
  */
 async store(req, res) {
   // check if user exists
   const { email } = req.body
   const userExists = await User.findOne({ where: { email } });
   if (userExists) {
     return res.status(400).json({ error: 'User alredy exists'})
   }

   // if all is ok, store the user
   const { id, name } = await User.create(req.body);
   return res.json({ id, name, email });
 }

}

export default new UserController();
