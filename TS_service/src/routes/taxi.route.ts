// src/routes/taxiRoutes.ts
import { Router } from 'express';
import { TaxiController } from '../controllers/taxi.controller';

const router = Router();

router.get('/nearby', TaxiController.getNearbyTaxis);

export default router;