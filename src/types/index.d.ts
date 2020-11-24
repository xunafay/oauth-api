import { Span } from '../models/span';

declare module 'express' {
  export interface Request {
    span?: Span,
  }
}
