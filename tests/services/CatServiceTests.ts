import 'mocha';
import { CatService } from '../../src/services/CatService';
import { CatRepository } from '../../src/repositories/CatRepository';
import { Redis } from '../../src/clients/Redis';
import { Cat, Color } from '../../src/models/Cat';
import assert = require('assert');
import { config } from '../../src/config';

describe('CatService', () => {
  const redisConfig = {
    ...config.redis,
    keyPrefix: 'test-',
  };

  const redis = new Redis(redisConfig);
  const catRepository = new CatRepository(redis);
  const catService = new CatService(catRepository);
  const cat: Pick<Cat, 'name' | 'age' | 'color'> = {
    name: 'testcat',
    age: 3,
    color: Color.Brawn,
  };
  let catId;
  before(async () => {
    const result = await catService.create(cat);
    catId = result.id;
  });

  after(async () => {
    await catService.delete(catId);
  });

  describe('getAll', () => {
    it('should return list of cats', async () => {
      const result = await catService.getAll();
      assert.strictEqual(result.length, 2);
    });
  });
});
