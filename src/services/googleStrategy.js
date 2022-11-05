import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../models/User';
import Account from '../models/Account';

const serverUrl = process.env.NODE_ENV === 'development' ? process.env.SERVER_URL_DEV : process.env.SERVER_URL_PROD;
const googleLogin = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${(serverUrl, process.env.GOOGLE_CALLBACK_URL)}`,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    try {
      const oldUser = await User.findOne({ email: profile.email });

      if (oldUser) {
        return done(null, oldUser);
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const newUser = await new User({
        username: `user${profile.id}`,
        email: profile.email,
        name: profile.displayName,
        picture: profile.picture,
        pricing: 'free',
        publicVisible: false,
        provider: 'google',
      }).save();
      done(null, newUser);
      Account.create({ email: profile.email, username: `user${profile.id}` }, function (err, doc) {
        if (err) return console.log(err);
        console.log('account modal created');
      });
    } catch (err) {
      console.log(err);
    }
  },
);

passport.use(googleLogin);
