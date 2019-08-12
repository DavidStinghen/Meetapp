import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize
      },
    );

    // hook to create a hash of password in password_hash before save when store
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // association
  static associate(models) {
    this.hasMany(models.Meetup);
    this.hasMany(models.Subscription);
  }

  // method to verify if login's password is equal password in db
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
