import Express from 'express';
import { Span } from '../models/span';

export class Metrics {
  static startMiddleware(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    req.span = new Span(req, {start: true});
    next();
  }

  static endMiddleware(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    req.span!.end();
    req.span!.commit();
    next();
  }
}
