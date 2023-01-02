import { Request, Response } from 'express';

export const getUsers = (_: Request, res: Response): void => {
  // todo
  res.json({ message: 'get users coming right up' });
};

export const getUser = (req: Request, res: Response): void => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'get user coming right up' });
};

export const deleteUser = (req: Request, res: Response): void => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'delete user coming right up' });
};

export const createUser = (req: Request, res: Response): void => {
  // todo
  console.log(req.body);
  res.json({ message: 'create user coming right up' });
};

export const updateUser = (req: Request, res: Response): void => {
  // todo
  console.log(req.body);
  res.json({ message: 'update user coming right up' });
};
