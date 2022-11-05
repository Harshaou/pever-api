import User from '../../models/User';
import Account from '../../models/Account';
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import crypto from 'crypto';

const router = Router();

router.get('/profiles', async (req, res) => {
  try {
    let result = await User.aggregate([
      {
        $unwind: '$profileView',
      },
      {
        $match: { publicVisible: true },
      },
      {
        $sort: {
          profileView: -1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
