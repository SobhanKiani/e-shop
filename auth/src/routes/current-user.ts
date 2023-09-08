import express, {Request, Response} from 'express';
import { currentUser } from '@sobhankiani/e-shop-common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
