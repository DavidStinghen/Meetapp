import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  // method to subscribe in a meetup
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(
      req.params.id,
      {
        include: [User]
      }
    );

    // check if is a organizer
    if (meetup.user_id === req.userId) {
      return res.status(401).json({
        error: "You can't subscribe to your own meetups"
      });
    }

    // check if is a past date
    if (meetup.past) {
      return res.status(401).json({
        error: 'This meetup has alredy ocurred'
      });
    }

    // check if user have more meetups in the same hour
    const checkDate = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          required: true,
          where: { date: meetup.date }
        },
      ],
    });
    if (checkDate) {
      return res.status(401).json({
        error: "You can't subscribe to two meetups at the same time"
      });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id
    });

    // send email to organizer
    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }

  // method to list user subcribed meetups
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });
    
    return res.json(subscriptions);
  }
}

export default new SubscriptionController();

