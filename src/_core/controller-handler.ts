import { NextFunction, Request, Response } from 'express';

// todo
export function controllerHandler(req: Request, res: Response, next: NextFunction) {
  const controllers: Record<string, string> = req.app.get('controllers');
}
