import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  /**
   * method to store a new user
   * data validation
   * check if user exists
   * store a new user
  */
 async store(req, res) {
   // data for validation
   const schema = Yup.object().shape({
     name: Yup.string().required(),
     email: Yup.string()
      .email()
      .required(),
     password: Yup.string()
      .required()
      .min(6),
   });
   // verify data
   if (!(await schema.isValid(req.body))) {
     return res.status(400).json({ error: 'Validation fails' });
   }

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

 /**
  * method to update user data
  * data validation
  * verify if user exists
  * vefify oldPassword and oldPassword provided
  * update data
  */
 async update(req, res) {
   // data for validation
   const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(),
    oldPassword: Yup.string().min(6),
    // validate password if user provide oldPassword
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
    // user have to confirm new password
    confirmPassword: Yup.string().when('password', (password, field) =>
      password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });
  // verify data
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

   const { email, oldPassword } = req.body;
   const user = await User.findByPk(req.userId)

   // verify if user exists
  if (email !== user.email) {
    const userExists = await User.findOne({ where: { email }});
    if (userExists) {
      return res.status(400).json({ error: 'User alredy exists' });
    }
  }

  // verify if oldaPssword is equal from oldPassword provided
  if (oldPassword && !(await user.checkPassword(oldPassword))) {
    return res.status(401).json({ error: 'Password does not match' });
  }

  // update data
  const { id, name } = await user.update(req.body);
  return res.json({ id, name, email });
 }
}

export default new UserController();
