import { SectorsRepository } from './sectors.repository';

export class SectorsService {
  private repo = new SectorsRepository();

  async create(data: any) {
    return this.repo.create(data);
  }

  async listAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }

  async update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}

export const sectorsService = new SectorsService();
