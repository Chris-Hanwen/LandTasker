import bcrypt from 'bcrypt';
const encryptPassword = async (plainText: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hash(plainText, salt);
  return { salt, hashPassword };
};
export { encryptPassword };
