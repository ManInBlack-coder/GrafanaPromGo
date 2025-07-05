import {Router} from 'express';
import authRoutes from './auth.route'
import ridesRoutes from './rides.route'
import taxiRoutes from './taxi.route'
import userRoutes from './user.route'

const router = Router();

router.use('/auth', authRoutes);
router.use('/rides', ridesRoutes);
router.use('/taxis', taxiRoutes);
router.use('/users', userRoutes)

export default router;
