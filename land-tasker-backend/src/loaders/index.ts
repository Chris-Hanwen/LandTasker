import expressLoader from './express';
import mongooseLoader from './mongoose';

const loaderInit = () => {
  expressLoader();
  mongooseLoader();
};

export default loaderInit;
