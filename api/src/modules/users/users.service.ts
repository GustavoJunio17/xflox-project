import { UsersRepository } from './users.repository';
import bcrypt from 'bcrypt';

export class UsersService {
  private repository = new UsersRepository();

  async create(userData: any) {
    // 1. Regra de Negócio: Verificar duplicidade
    const userExists = await this.repository.findByEmail(userData.email);
    if (userExists) {
      throw new Error("Usuário já cadastrado com este e-mail.");
    }

    // 2. Segurança: Criptografar a senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // 3. Persistência: Mandar para o repositório
    return this.repository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async listAll() {
    return this.repository.findAll();
  }

  async changeRole(userId: string, role: string) {
    return this.repository.update(userId, { role });
  }
}