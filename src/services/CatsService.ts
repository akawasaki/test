import { Redis } from '../clients/Redis';
import { Cat } from '../models/Cat';
import * as uuid from 'uuid';
import { InternalServerError } from '../CustomErrors';

export class CatsService {
  key = 'cat';
  constructor(private readonly redis: Redis) {}

  async create(params: Pick<Cat, 'name' | 'age' | 'color'>): Promise<Cat> {
    const cat: Cat = {
      ...params,
      id: uuid.v4(),
    };
    await this.redis.hset(this.key, cat.id, JSON.stringify(cat));
    return cat;
  }

  async get(id: Cat['id']): Promise<Cat | null> {
    const cat = await this.redis.hget(this.key, id);
    return cat ? JSON.parse(cat) : null;
  }

  async getAll(): Promise<Cat[]> {
    const cats = await this.redis.hgetall(this.key);
    return Object.values(cats).map((cat) => JSON.parse(cat));
  }

  async updateName(id: Cat['id'], name: Cat['name']): Promise<Cat> {
    const cat = await this.get(id);
    if (!cat) {
      throw new InternalServerError(`Cannot find cat ${id}`);
    }

    cat.name = name;
    return this.update(cat);
  }

  async updateColor(id: Cat['id'], color: Cat['color']): Promise<Cat> {
    const cat = await this.get(id);
    if (!cat) {
      throw new InternalServerError(`Cannot find cat ${id}`);
    }

    cat.color = color;
    return this.update(cat);
  }

  private async update(cat: Cat): Promise<Cat> {
    await this.redis.hset(this.key, cat.id, JSON.stringify(cat));
    return cat;
  }
}
