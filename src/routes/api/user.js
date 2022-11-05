import User from '../../models/User';
import Account from '../../models/Account';
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { seedDb } from '../../utils/seed';

const router = Router();

router.post('/editUserInfo', requireJwtAuth, async (req, res) => {
  console.log(req.body)
  try {
    const { username, firstName, primaryRole, bio } = req.body;
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { username, firstName, primaryRole, bio } },
      { new: true },
    );
    let acc = await Account.findOneAndUpdate({ email: req.user.email }, { $set: { username } }, { new: true });
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/username/:username', requireJwtAuth, async (req, res) => {
  const { username } = req.params;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(200).json('Already Exists');
    } else {
      return res.status(200).json('Valid');
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/addProfileView', requireJwtAuth, async (req, res) => {
  console.log('moon');
  let count;
  if (req.user.profileView) {
    count = req.user.profileView + 1;
  } else {
    count = 1;
  }
  let updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, { $set: { profileView: count } }, { new: true });
  return await res.status(200).json(updatedUser);
});

router.get('/me', requireJwtAuth, (req, res) => {
  const me = req.user.toJSON();
  res.json({ me });
});

router.get('/reseed', async (req, res) => {
  await seedDb();
  res.json({ message: 'Database reseeded successfully.' });
});

export default router;
