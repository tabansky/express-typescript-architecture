import { Kernel } from '@core/kernel';

import { providers } from './providers';

const app = new Kernel().provide(providers).boot();

export default app;
