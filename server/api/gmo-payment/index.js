import express from 'express';
import controller from './gmo-payment.controller';

const router = express.Router();

router.post('/charge', controller.charge);

export default router;
