import User from '../../models/User';
import Account from '../../models/Account';
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import crypto from 'crypto';

const router = Router();

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    let user = await User.findOne({ username });
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/publicAvailability', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { publicVisible: req.body.event } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/changePricing', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { pricing: req.body.plan } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/availability/availability', requireJwtAuth, async (req, res) => {
  try {
    let account = await Account.findOne({ email: req.user.email });
    return res.status(200).json(account.availability);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/availability', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await Account.findOneAndUpdate(
      { email: req.user.email },
      { $set: { availability: req.body } },
      { new: true },
    );
    return res.status(200).json(updatedUser.availability);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/getBookings/bookings', requireJwtAuth, async (req, res) => {
  try {
    let account = await Account.findOne({ email: req.user.email });
    return res.status(200).json(account.booking);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/createBooking', requireJwtAuth, async (req, res) => {
  const { name, username, pricing, picture } = req.user;
  const { bookValue, userProfile } = req.body;

  try {
    let profile = await Account.findOne({ username: userProfile.username }).exec();
    let profileUpdate = {
      ...profile.booking,
      incoming: [{ name, username, pricing, picture, ...bookValue }, ...profile.booking.incoming],
    };

    let profileUpdated = await Account.findOneAndUpdate(
      { username: userProfile.username },
      { $set: { booking: profileUpdate } },
      { new: true },
    );
    if (profileUpdated) {
      let myProfile = await Account.findOne({ email: req.user.email }).exec();
      let userUpdate = {
        ...myProfile.booking,
        outgoing: [{ ...userProfile, ...bookValue }, ...myProfile.booking.outgoing],
      };
      let userUpdated = await Account.findOneAndUpdate(
        { email: req.user.email },
        { $set: { booking: userUpdate } },
        { new: true },
      );
      return res.status(200).json(userUpdated);
    } else {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editBooking', requireJwtAuth, async (req, res) => {
  const { username, meUpdated } = req.body;
  try {
    let { booking } = await Account.findOne({ username }).exec();
    let filtered = booking.outgoing.filter((item) => item.username !== req.user.username);
    let accepted = booking.outgoing.find((item) => item.username === req.user.username);
    let userUpdate = { ...booking, outgoing: filtered, scheduled: [accepted, ...booking.scheduled] };
    let userUpdated = await Account.findOneAndUpdate({ username }, { $set: { booking: userUpdate } }, { new: true });

    if (userUpdated) {
      let profileUpdated = await Account.findOneAndUpdate(
        { username: req.user.username },
        { $set: { booking: meUpdated } },
        { new: true },
      );
      return res.status(200).json(profileUpdated.booking);
    } else {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/deleteBooking', requireJwtAuth, async (req, res) => {
  const {
    info: { username, page },
    meUpdated,
  } = req.body;
  try {
    console.log('1');
    let { booking } = await Account.findOne({ username }).exec();
    let filtered = booking[page].filter((item) => item.username !== req.user.username);
    let userUpdate = { ...booking, [page]: filtered };
    console.log('userUpdate', userUpdate);
    let userUpdated = await Account.findOneAndUpdate({ username }, { $set: { booking: userUpdate } }, { new: true });

    if (userUpdated) {
      let profileUpdated = await Account.findOneAndUpdate(
        { username: req.user.username },
        { $set: { booking: meUpdated } },
        { new: true },
      );
      return res.status(200).json(profileUpdated.booking);
    } else {
      res.status(500).json({ message: 'Something went wrong.' });
    }
    res.status(200).json({ message: 'Something went wrong.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
