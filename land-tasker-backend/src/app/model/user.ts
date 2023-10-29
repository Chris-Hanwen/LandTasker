import { Schema, model } from 'mongoose';
interface IUser {
  fullName: string;
  email: string;
  password: string;
  location: string;
  postCode: number;
  gender: string;
  birthday: Date;
  phone: number;
  about: string;
  type: string;
  review: string;
  category: string;
  services: string;
  comments: object;
  posts: object;
  reviews: object;
  serviceRate: number;
  active: boolean;
  activationCode: string;
  passwordSalt: string;
  findByCredentials(email: string, password: string): unknown;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: 'String', require: true, trim: true },
    email: {
      type: 'string',
      require: true,
      unique: true,
      match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please fill a valid email address'],
    },
    password: { type: 'string', require: true, trim: true },
    location: { type: 'string', require: true, trim: true },
    postCode: { type: 'number' },
    gender: { type: 'string', enum: ['M', 'F', 'X'] },
    birthday: { type: Date },
    phone: { type: 'number' },
    about: { type: 'string' },
    type: { type: 'string', enum: ['Provider', 'Customer'] },
    review: { type: 'string' },
    category: { type: 'string', enum: ['Cleaning', 'Moving', 'etc'] },
    services: { type: 'string' },
    comments: { type: 'array' },
    posts: { type: 'array' },
    reviews: { type: 'array' },
    active: { type: 'boolean', default: false },
    activationCode: { type: 'string' },
    passwordSalt: { type: 'string' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.passwordSalt;
        delete ret.active;
        delete ret.activationCode;
      },
    },
  },
);

const User = model<IUser>('users', userSchema);

export default User;
