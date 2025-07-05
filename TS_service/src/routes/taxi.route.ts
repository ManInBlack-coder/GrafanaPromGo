// src/routes/taxiRoutes.ts
import { Router } from 'express';
import { TaxiController } from '../controllers/taxi.controller';

const taxiRoutes = Router();

taxiRoutes.get('/nearby', TaxiController.getNearbyTaxis);

export default taxiRoutes;