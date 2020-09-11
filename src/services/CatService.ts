import { Cat } from '../models/Cat';
import * as uuid from 'uuid';
import { NotFoundError } from '../CustomErrors';
import { CatRepository } from '../repositories/CatRepository';

export class CatService {
  constructor(private readonly catRepository: CatRepository) {}

  async create(params: Pick<Cat, 'name' | 'age' | 'color'>): Promise<Cat> {
    const cat: Cat = {
      ...params,
      id: uuid.v4(),
    };
    return this.catRepository.set(cat);
  }

  async get(id: Cat['id']): Promise<Cat> {
    const cat = await this.catRepository.get(id);
    if (!cat) {
      throw new NotFoundError(`Cannot find cat ${id}`);
    }
    return cat;
  }

  async getAll(): Promise<Cat[]> {
    return this.catRepository.getAll();
  }

  async updateName(id: Cat['id'], name: Cat['name']): Promise<Cat> {
    const cat = await this.get(id);
    cat.name = name;
    return this.update(cat);
  }

  async updateColor(id: Cat['id'], color: Cat['color']): Promise<Cat> {
    const cat = await this.get(id);
    cat.color = color;
    return this.update(cat);
  }

  async delete(id: Cat['id']) {
    await this.catRepository.delete(id);
  }

  private async update(cat: Cat): Promise<Cat> {
    return this.catRepository.set(cat);
  }
}
