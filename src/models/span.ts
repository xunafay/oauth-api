import { Request } from 'express';
import { getEpoch } from '../services/util';
import { sofa } from '../services/sofa';

export class Span {
  ip: string;
  startTime?: [number, number];
  elapsedTime?: number;
  path: string;
  method: string;
  agent?: string;
  code?: number;
  createdAt: number;
  user?: string;

  constructor(req: Request, opts?: {start: boolean}) {
    this.ip = req.ip;
    this.path = req.path;
    this.method = req.method;
    this.createdAt = getEpoch();
    this.agent = req.headers['user-agent'];

    if (opts?.start) {
      this.start();
    }
  }

  start(): void {
    this.startTime = process.hrtime();
  }

  end(): void {
    this.elapsedTime = process.hrtime(this.startTime)[1] / 1000000; // nano to milliseconds
    this.startTime = undefined;
  }

  async commit(): Promise<void> {
    if (this.path === '/health') { // avoid spamming the metrics with liveness probe
      return;
    }

    sofa.db.apiLogs.insert(this);
  }
}
