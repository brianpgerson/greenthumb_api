import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import config from '../../config/config';
import { User } from "../../database/models/User"

export interface LoggedInUser {
  id: number;
  email: string;
}

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization")
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing auth credential'});
  }

  const token = authHeader.split('Bearer ')[1]
  try {
    const user = jwt.verify(token, config.jwt_secret) as LoggedInUser;
    req.loggedInUser = user;
    return next()    
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      console.log('expired token');
      return res.status(498).json({ error: e.message });  
    }

    return res.status(401).json({ error: e.message });
  }
}

export const refreshJwt = async (req: Request, res: Response, next: NextFunction) => {
  const refreshTokenHeader = req.header('xxx-refresh-token')
  if (!refreshTokenHeader) {
    return res.status(401).json({ error: 'No refresh token supplied'});
  }

  const authHeader = req.header("Authorization")
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing auth credential'});
  }

  const refreshToken = refreshTokenHeader.split('Token ')[1]
  const authToken = authHeader.split('Bearer ')[1]
  try {
    const user = jwt.verify(authToken, config.jwt_secret, { ignoreExpiration: true }) as LoggedInUser;
    const refreshUser = jwt.verify(refreshToken, config.jwt_refresh_secret) as LoggedInUser;

    if (user.email !== refreshUser.email || user.id !== refreshUser.id) {
      return res.status(401).json({ error: 'Mismatched auth and refresh tokens!'});
    }

    const persistedUser = await User.findByPk(user.id);
    if (persistedUser !== null) {
      req.loggedInUser = refreshUser;
      return next();
    }

    res.status(401).json({ error: 'Forbidden' });
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      console.log('expired refresh token');
      return res.status(498).json({ error: e.message });  
    }

    return res.status(401).json({ error: e.message });
  }
}

