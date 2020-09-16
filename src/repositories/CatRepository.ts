import { Redis } from '../clients/Redis';
import { Cat } from '../models/Cat';
import { injectable } from 'tsyringe';

@injectable()
export class CatRepository {
  key = 'cat';

  constructor(private readonly redis: Redis) {}

  async set(cat: Cat): Promise<Cat> {
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

  async delete(id: Cat['id']) {
    await this.redis.hdel(this.key, id);
  }
}
