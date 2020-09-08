import { Get } from './Router';
import { Post } from './Router';
import { CatsService } from '../services/CatsService';
import { Color } from '../models/Cat';

interface CreateCatRequest {
  name: string;
  age?: number;
  color: Color;
}

interface GetCatRequest {
  id: string;
}

export class SimpleController {
  constructor(private readonly catsService: CatsService) {}

  @Get('/health')
  async healthCheck() {
    return "I'm alive!";
  }

  @Get('/cats/:id')
  async get({ id }: GetCatRequest) {
    return this.catsService.get(id);
  }

  @Get('/cats')
  async getAll() {
    return this.catsService.getAll();
  }

  @Post('/cat')
  async create(cat: CreateCatRequest) {
    return this.catsService.create(cat);
  }
}
