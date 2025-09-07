import express from 'express';
import { signup, signin, signout } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.get('/signin', signin);
authRouter.post('/signout', signout);

export default authRouter;