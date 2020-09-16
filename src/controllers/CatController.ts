import { Delete, Get, Put, Route } from './Router';
import { Post } from './Router';
import { Color } from '../models/Cat';
import { singleton } from 'tsyringe';
import { ICatService } from '../services/ICatService';

interface CreateRequest {
  name: string;
  age?: number;
  color: Color;
}

interface BaseRequest {
  id: string;
}

interface UpdateNameRequest {
  id: string;
  name: string;
}

interface UpdateColorRequest {
  id: string;
  color: Color;
}

@singleton()
@Route('/cats')
export class CatController {
  constructor(private readonly catsService: ICatService) {}

  @Get('/health')
  async healthCheck() {
    return "I'm alive!";
  }

  @Get('/:id')
  async get({ id }: BaseRequest) {
    return this.catsService.get(id);
  }

  @Get('')
  async getAll() {
    return this.catsService.getAll();
  }

  @Post('')
  async create(cat: CreateRequest) {
    return this.catsService.create(cat);
  }

  @Put('/:id/names')
  async updateName({ id, name }: UpdateNameRequest) {
    return this.catsService.updateName(id, name);
  }

  @Put('/:id/colors')
  async updateColor({ id, color }: UpdateColorRequest) {
    return this.catsService.updateColor(id, color);
  }

  @Delete('/:id')
  async delete({ id }: BaseRequest) {
    await this.catsService.delete(id);
  }
}
