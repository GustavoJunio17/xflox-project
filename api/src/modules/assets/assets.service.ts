import { assetsRepository } from './assets.repository';

export class AssetsService {
  private repo = assetsRepository;

  async create(data: any) {
    return this.repo.create(data);
  }

  async list() {
    return this.repo.findAll();
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

export const assetsService = new AssetsService();
