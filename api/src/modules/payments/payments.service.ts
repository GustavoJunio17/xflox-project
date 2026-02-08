import { paymentsRepository } from './payments.repository';

export class PaymentsService {
  private repo = paymentsRepository;

  async create(data: any) {
    return this.repo.create(data);
  }

  async list(filters?: any) {
    return this.repo.findAll(filters);
  }

  async get(id: string) {
    return this.repo.findById(id);
  }

  async update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}

export const paymentsService = new PaymentsService();
