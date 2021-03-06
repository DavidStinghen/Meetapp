import * as Yup from 'yup';
import { isBefore, parseISO, startOfDay, endOfDay} from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  // method to list meetups
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);
      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        },
        {
          model: File,
          attributes: ['id', 'path', 'url']
        }
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  // method to create a meetup
  async store(req, res) {
    // data validation
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // check if is a past date
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    const user_id = req.userId;
    const meetup = await Meetup.create({...req.body, user_id});

    return res.json(meetup);
  }

  // method to update a meetup
  async update(req, res) {
     // data validation
     const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // check user
    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized'});
    }

    // check is a past date
    if (meetup.past) {
      return res.status(400).json({
        error: "You can't update past meetups"
      });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  // method to delete a meetup
  async delete(req, res) {
    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    // checke user
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ errorr: 'Not authorized' });
    }

    // check if is past date
    if (meetup.past) {
      return res.status(400).json({
        error: "You can't delete past meetups"
      });
    }

    await meetup.destroy()

    return res.send();
  }

}

export default new MeetupController();
