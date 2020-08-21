import { Redis } from '../clients/Redis';

export class CatsService {
    constructor(private readonly redis: Redis) {
    }

    async create(){
        await this.redis.set('1', 'cat1');
    }

    async get(key : string) {
        return await this.redis.get(key);
    }
}
