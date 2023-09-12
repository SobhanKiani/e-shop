import express from 'express';
import { BadRequestError, currentUser } from '@sobhankiani/e-shop-common';
import { logger } from '../app';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  const user = req.currentUser
  if (!user) {
    new BadRequestError("User Not Found");
  }

  res.send({ currentUser: user || null });
});

export { router as currentUserRouter };
