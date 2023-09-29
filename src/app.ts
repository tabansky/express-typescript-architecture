import { Kernel } from '@core/kernel';
import express from 'express';

const app = express();

Kernel.integrateTo(app);

export default app;
