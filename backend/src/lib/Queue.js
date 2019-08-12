import Bee from 'bee-queue';
import * as Sentry from '@sentry/node';
import sentryConfig from '../config/sentry';
import SubscriptionMail from  '../app/jobs/SubscriptionMail';
import redisConfig from '../config/redis';

Sentry.init(sentryConfig);

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  // method to load the row
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // method to add a job in row
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // method to process a jobs in row
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
    Sentry.captureException(err);
  }
}

export default new Queue();
