import { Controller } from '@core/abstract/abstract.controller';
import { Application } from '@core/declarations';
import { Request, Response } from 'express';

export class ExampleController extends Controller {
  constructor(app: Application) {
    super(app);
  }

  public index(req: Request, res: Response): void {
    res.status(200).json({ data: 'example' });
  }
}
