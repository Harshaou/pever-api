import User from '../../models/User';
import Account from '../../models/Account';
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const router = Router();

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    let user = await User.findOne({ username });

    let count;
    if (user.profileView) {
      count = user.profileView + 1;
    } else {
      count = 1;
    }
    let updatedUser = await User.findOneAndUpdate({ username }, { $set: { profileView: count } }, { new: true });
    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/getAvailability/:email', async (req, res) => {
  const { email } = req.params;
  try {
    let account = await Account.findOne({ email });
    return res.status(200).json(account.availability);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/pay', async (req, res) => {
  const razorpay = new Razorpay({
    key_id: 'rzp_test_FxvK25tQ7cdiXD',
    key_secret: '2IqkkTl8hAAp0B36SCBkS4AC',
  });
  const payment_capture = 1;
  const amount = 499;
  const currency = 'INR';

  const options = {
    amount: amount * 100,
    currency,
    receipt: crypto.randomBytes(4).toString('hex'),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/searchProfiles', requireJwtAuth, async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $search: {
          index: 'default',
          text: {
            query: req.body,
            path: {
              wildcard: '*',
            },

            fuzzy: {
              maxEdits: 2,
              prefixLength: 1,
            },
          },
        },
      },
    ]);

    // db.textcol.aggregate([
    //   { $match: { $text: { $search: 'item' }, _parentIds: { $in: ['345'] } } },
    //   { $project: { displayTitle: 1, title: 1, _type: 1, _id: 0, _parentIds: 1, score: { $meta: 'textScore' } } },
    //   { $match: { score: { $gt: 0.5 } } },
    // ]);

    return await res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
