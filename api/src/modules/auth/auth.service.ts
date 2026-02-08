import { UsersRepository } from '../users/users.repository';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../../config';

export class AuthService {
  private usersRepo = new UsersRepository();

  async login(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new Error('Usuário ou senha inválidos');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Usuário ou senha inválidos');

    const secret: Secret = config.jwtSecret as Secret;
    const options: SignOptions = { subject: user.id, expiresIn: config.jwtExpiresIn as any };

    const token = jwt.sign({ role: user.role }, secret, options);

    return { token, user };
  }
}

export const authService = new AuthService();
