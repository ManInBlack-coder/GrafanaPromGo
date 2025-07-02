import {Router} from 'express';
import authRoutes from './auth.route'
import ridesRoutes from './rides.route'
import taxiRoutes from './taxi.route'

const router = Router();

router.use('/auth', authRoutes);
router.use('/rides', ridesRoutes);
router.use('/taxis', taxiRoutes);


export default router;
