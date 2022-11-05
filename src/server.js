import './services/loadConfig';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import routes from './routes';
import { seedDb } from './utils/seed';
import { resolve, join } from 'path';
const app = express();

// Bodyparser Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/googleStrategy');
require('./services/localStrategy');

const isDevelopment = process.env.NODE_ENV === 'development';

// DB Config
const dbConnection = isDevelopment ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PROD;

mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected..');
    // seedDb();
  })
  .catch((err) => console.log(err));

// Use Routes
app.use('/', routes);

app.get('/helo', (req, res) => {
  res.send('heloooo');
});

app.use('/public', express.static(join(__dirname, '../public')));
app.use(express.static(join(__dirname, '../../client/build')));
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, '../..', 'client', 'build', 'index.html')); // index is in /server/src so 2 folders up
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
