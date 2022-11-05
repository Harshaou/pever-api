import { Router } from 'express';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import AWS from 'aws-sdk';
import { resetPasswordTemplate } from '../utils/emailTemplate';

import User from '../models/User';
import Account from '../models/Account';
import requireLocalAuth from '../middleware/requireLocalAuth';
import { registerSchema } from '../services/validators';

const router = Router();

router.post('/login', requireLocalAuth, (req, res) => {
  const token = req.user.generateJWT();
  const me = req.user.toJSON();
  res.json({ token, me });
});

router.post('/register', async (req, res, next) => {
  const { email, password, name } = req.body;
  const username = name.split(' ')[0] + crypto.randomBytes(4).toString('hex');
  const body = { email, password, name, username };
  console.log(body);
  const { error } = Joi.validate(body, registerSchema);
  if (error) {
    return res.status(422).send({ message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ message: 'Email is in use' });
    }

    try {
      const newUser = await new User({
        provider: 'email',
        email,
        password,
        username,
        name,
        pricing: 'free',
        publicVisible: false,
        picture:
          'https://cdn.dribbble.com/users/334862/screenshots/16460904/media/d63d1f7e91c92a46e35d74bfdf1e4b02.png?compress=1&resize=1600x1200&vertical=top',
      });

      newUser.registerUser(newUser, (err, user) => {
        if (err) throw err;
        res.json({ message: 'Register success.' }); // just redirect to login
      });
      Account.create({ email, username }, function (err, doc) {
        if (err) return console.log(err);
        console.log('account modal created');
      });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    console.log('err', err);
    return next(err);
  }
});

router.post('/changepassword', requireLocalAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    let check = await bcrypt.compare(oldPassword, req.user.password);
    if (!check) res.status(422).send({ message: 'Password incorrect' });
    if (check) {
      const salt = await bcrypt.genSalt(10);
      const updatedPassword = await bcrypt.hash(newPassword, salt);
      if (updatedPassword) {
        let resp = await User.findByIdAndUpdate({ _id: req.user._id }, { password: updatedPassword });
        console.log(resp);
        return res.status(200).json(resp);
      }
    }
  } catch (err) {
    console.log('err', err);
  }
});

router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json('Already Exists');
    } else {
      return res.status(200).json('Valid');
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/resetConfirm', async (req, res) => {
  console.log('hey', req.body);
  try {
    const { password, token } = req.body;
    User.findOne({ resetToken: token, expiryToken: { $gt: Date.now() } }).then((user) => {
      if (!user) return res.status(422).json({ error: 'Session expired' });
      bcrypt.hash(password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expiryToken = undefined;
        user.save().then(() => res.json('updated'));
      });
    });
  } catch (err) {
    console.log('err', err);
  }
});

const CLIENT_ID = '547184616493-f4d3ce71068e4g5v4776iumjjbu9gspf.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
  '1//04WP9Hy-0uF8qCgYIARAAGAQSNwF-L9Irm3vxyAOp99b0BrXQdNlPSirpeFvBaFeK7TgkayUyXL5iwfqjoTgDV0YR3-j2hnulyxU';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLEINT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(toMail, token) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'harsh.haou@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Reset password <harsh.haou@gmail.com>',
      to: toMail,
      subject: 'Reset password',
      text: 'Reset password request',
      html: resetPasswordTemplate(token),
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

// function sendMail(emailTo, token) {
//   const ses = new AWS.SES({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     region: process.env.S3_BUCKET_REGION,
//   });

//   var params = {
//     Destination: {
//       ToAddresses: [emailTo],
//     },
//     Message: {
//       Body: {
//         Html: {
//           // HTML Format of the email
//           Charset: 'UTF-8',
//           Data: `<html><body><h1>Rest Password</h1><p style='color:red'>Sample description</p> <h5>Click in this <a href="http://localhost:3001/reset/${token}">Link</a> to reset your password </h5></body></html>`,
//         },
//         Text: { Data: 'Haha' },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: 'Rest Password',
//       },
//     },
//     Source: 'hello@help.center',
//   };

//   return ses.sendEmail(params).promise();
// }

// router.post('/resetConfirm', async (req, res) => {
//   console.log('hey', req.body);
//   try {
//     const { password, token } = req.body;
//     User.findOne({ resettoken: token, expirytoken: { $gt: Date.now() } }).then((user) => {
//       if (!user) return res.status(422).json({ error: 'Session expired' });
//       bcrypt.hash(password, 10).then((hashedPassword) => {
//         user.password = hashedPassword;
//         user.resettoken = undefined;
//         user.expirytoken = undefined;
//         user.save().then(() => res.json('updated'));
//       });
//     });
//   } catch (err) {
//     console.log('err', err);
//   }
// });

// router.post('/reset', async (req, res) => {
//   console.log('hey', req.body);
//   try {
//     crypto.randomBytes(32, (err, buffer) => {
//       if (err) console.log(err);
//       else {
//         const token = buffer.toString('hex');
//         User.findOne({ email: req.body.email }).then((user) => {
//           if (!user) res.status(422).json('user dont exist');
//           user.resettoken = token;
//           user.expirytoken = Date.now() + 360000;
//           user.save().then((result) => {
//             sendMail(user.email, token)
//               .then((val) => {
//                 console.log('got this back', val);
//                 res.send('Check your mail');
//               })
//               .catch((err) => {
//                 res.send('/error');
//                 console.log('There was an error!', err);
//               });
//           });
//         });
//       }
//     });
//   } catch (err) {
//     console.log('err', err);
//   }
// });

router.post('/reset', async (req, res) => {
  try {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) console.log(err);
      else {
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then((user) => {
          if (!user) res.status(422).json('user dont exist');
          user.resetToken = token;
          user.expiryToken = Date.now() + 360000;
          user.save().then((result) => {
            sendMail(user.email, token)
              .then((val) => {
                console.log('got this back', val);
                res.send('Check your mail');
              })
              .catch((err) => {
                res.send('/error');
                console.log('There was an error!', err);
              });
          });
        });
      }
    });
  } catch (err) {
    console.log('err', err);
  }
});

router.post('/provider', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user && user.provider === 'email') {
      return res.status(200).json('true');
    } else {
      return res.status(200).json('false');
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.send(false);
});

export default router;
