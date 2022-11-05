import { Router } from 'express';
import user from './user';
import myProfile from './myProfile';
import listingProfile from './listing';
import account from './account';
import featured from './featured';
const router = Router();

router.use('/user', user);
router.use('/myProfile', myProfile);
router.use('/account', account);
router.use('/listing', listingProfile);
router.use('/featured', featured);

export default router;
