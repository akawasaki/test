import 'mocha';
import { CatService } from '../../src/services/CatService';
import { CatRepository } from '../../src/repositories/CatRepository';
import { Redis } from '../../src/clients/Redis';
import { Cat, Color } from '../../src/models/Cat';
import { config } from '../../src/config';
import assert = require('assert');
import { NotFoundError } from '../../src/CustomErrors';

describe('CatService', () => {
  const redisConfig = {
    ...config.redis,
    keyPrefix: 'test-',
  };

  const redis = new Redis(redisConfig);
  const catRepository = new CatRepository(redis);
  const catService = new CatService(catRepository);
  const cat1: Pick<Cat, 'name' | 'age' | 'color'> = {
    name: 'testcat1',
    age: 3,
    color: Color.Brawn,
  };
  const cat2: Pick<Cat, 'name' | 'age' | 'color'> = {
    name: 'testcat2',
    age: 5,
    color: Color.Black,
  };

  let cat1Id;
  let cat2Id;
  before(async () => {
    const result1 = await catService.create(cat1);
    cat1Id = result1.id;
    const result2 = await catService.create(cat2);
    cat2Id = result2.id;
  });

  after(async () => {
    await catService.delete(cat1Id);
    await catService.delete(cat2Id);
  });

  describe('getAll', () => {
    it('should return list of cats', async () => {
      const result = await catService.getAll();
      assert.strictEqual(result.length, 2);
    });
  });

  describe('get', () => {
    it('should return a cat1', async () => {
      const result = await catService.get(cat1Id);
      assert.deepStrictEqual(result, { id: `${cat1Id}`, name: `${cat1.name}`, age: cat1.age, color: `${cat1.color}` });
    });
  });

  describe('get not found', () => {
    it('given non existing id should throw not found', async () => {
      const error = new NotFoundError('Cannot find cat id');
      await assert.rejects(catService.get('id'), error);
    });
  });

  describe('updateName', () => {
    it('should update name', async () => {
      const result = await catService.updateName(cat2Id, 'updatedName');
      assert.deepStrictEqual(result, { id: `${cat2Id}`, name: 'updatedName', age: cat2.age, color: `${cat2.color}` });
    });
  });

  describe('updateColor', () => {
    it('should update color', async () => {
      const result = await catService.updateColor(cat1Id, Color.White);
      assert.deepStrictEqual(result, { id: `${cat1Id}`, name: `${cat1.name}`, age: cat1.age, color: `${Color.White}` });
    });
  });
});
