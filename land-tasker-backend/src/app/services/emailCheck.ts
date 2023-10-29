import User from '../model/user';

const emailCheck = async (email: string) => {
  const checkEmailFlag = await User.findOne({ email });
  if (checkEmailFlag) return true;
  return false;
};

export { emailCheck };
