import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';

import { updateUser, findUserById } from '../services/user-service';

export const configureUserRoutes = async (router: Router) => {
  router.put('/user/:userId', async (req: Request, res: Response) => {  
    const userId = Number(req.params.userId);
    const { updateUserRequest: { password, email, timezone, newPassword } } = req.body;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.'});
    }

    if ((email || newPassword)) {
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(400).json({ error: 'Password incorrect.'});
      }
    }

    const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : undefined;

    const updated = await updateUser(user, { email, timezone, password: hashedPassword });
    if (!updated) {
      return res.status(400).json({ error: 'Unable to update user.'});
    }
    
    return res.json({ user: updated })
  })

  return router;
}