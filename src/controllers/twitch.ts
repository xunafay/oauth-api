import { Router } from 'express';
import { Twitch } from '../services/twitch';

export class TwitchController {
  static router(): Router {
    return Router({caseSensitive: false})
      .post('/', async(req, res, next) => {
        const twitch = await Twitch.fromCode(req.body.code);
        console.log(`id: ${(await twitch.getUser()).id}`);
        console.log(`token: ${twitch.refreshToken}`);
        res.sendStatus(200);
        next();
      });
  }
}
