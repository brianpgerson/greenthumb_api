import { Router, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import config from '../config/config';
import { verifyJwt, refreshJwt, LoggedInUser } from '../middleware/auth/jwt-middleware';

import { createUser, findUserByEmail, findUserById, UserRequest } from '../services/user-service';

export const configureAuthRoutes = async (router: Router) => {

  router.post('/signup', async (req: Request, res: Response) => {  
    const { email, password, timezone } = req.body;

    const alreadyExists = await findUserByEmail(email);
    if (alreadyExists) {
      return res.status(400).json({ error: 'User with this email already exists.'});
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Must include email and password in signup request'});
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    var userRequest: UserRequest = { email, password: hashedPassword, timezone }
  
    const user = await createUser(userRequest);
    if (!user) {
      return res.status(500).json({ error: 'Unable to create user'});
    }

    const liu: LoggedInUser = { email: user.email, id: user.id };
    const accessToken = jwt.sign(liu, config.jwt_secret, { expiresIn: '7d' })
    const refreshToken = jwt.sign(liu, config.jwt_refresh_secret, { expiresIn: '30d' })

    return res.json({ accessToken, refreshToken, user })
  })
  
  router.post('/login', passport.authenticate('local', {
    session: false
  }), async (req: Request, res: Response) => {
    const { user } = req;
  
    if (user === undefined) {
      return res.status(400).json({ error: 'No credentials supplied in login request'});
    }
  
    const liu: LoggedInUser = { email: user.email, id: user.id };

    const accessToken = jwt.sign(liu, config.jwt_secret, { expiresIn: '7s' })
    const refreshToken = jwt.sign(liu, config.jwt_refresh_secret, { expiresIn: '30d' })

    return res.json({ accessToken, refreshToken, user })
  })

  router.post('/verify', verifyJwt, async (req: Request, res: Response) => {
    const liu = req.loggedInUser;
    if (!liu) {
      return res.status(400).json({ valid: false });
    }
    
    const user = await findUserById(liu.id)
    return res.status(200).json({ valid: true, user });
  })

  router.post('/refresh', refreshJwt, async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    if (loggedInUser === undefined) {
      return res.status(401).json({ error: 'Missing user.'});
    }

    const liu: LoggedInUser = { email: loggedInUser.email, id: loggedInUser.id };
    const user = await findUserById(liu.id)
    const accessToken = jwt.sign(liu, config.jwt_secret, { expiresIn: '1d' })

    return res.json({ accessToken, user });
  })

  return router;
}