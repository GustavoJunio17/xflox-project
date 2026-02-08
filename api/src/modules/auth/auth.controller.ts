import { Request, Response } from 'express';
import { authService } from './auth.service';
import { auditService } from '../../shared/services/audit.service';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      await auditService.log({ userId: result.user.id, action: `Usuário ${result.user.email} efetuou login`, targetType: 'auth' });
      return res.json({ token: result.token });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export const authController = new AuthController();
