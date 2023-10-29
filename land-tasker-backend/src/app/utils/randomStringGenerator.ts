import { v4 as uuidv4 } from 'uuid';

const randomStringGenerator = () => {
  return uuidv4();
};

export { randomStringGenerator };
