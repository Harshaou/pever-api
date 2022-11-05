import User from '../models/User';

export const seedDb = async () => {
  console.log('Seeding database...');
  await User.deleteMany({});
};
