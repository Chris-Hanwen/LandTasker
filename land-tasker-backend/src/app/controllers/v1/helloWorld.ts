import { Request, Response } from 'express';

const showHelloWorld = async (req: Request, res: Response) => {
  res.send('hello world');
};

export { showHelloWorld };
