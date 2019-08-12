import Meetup from '../models/Meetup';

class ScheduleController {
  // method to list all meetups created by a provider
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId}
    });

    return res.json(meetups);
  }
}

export default new ScheduleController();
