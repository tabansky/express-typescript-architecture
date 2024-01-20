import { RouterComponents } from '@core/types';

import * as Auth from './api/auth.route';

export const apiRoutes: RouterComponents[] = [
  Auth.default,
];
