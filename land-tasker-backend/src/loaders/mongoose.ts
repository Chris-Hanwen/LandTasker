import mongoose from 'mongoose';
import config from '../app/config/app';

const mongooseLoader = async function () {
  try {
    mongoose.connection
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      })
      .on('open', () => {
        // eslint-disable-next-line no-console
        console.log('⚡️[Database]: Database is connected');
      });

    await mongoose.connect(config.db, { dbName: 'landtasker' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
export default mongooseLoader;
