import { Delete, Get, Put } from './Router';
import { Post } from './Router';
import { CatService } from '../services/CatService';
import { Color } from '../models/Cat';

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

export class CatController {
  constructor(private readonly catsService: CatService) {}

  @Get('/health')
  async healthCheck() {
    return "I'm alive!";
  }

  @Get('/cats/:id')
  async get({ id }: BaseRequest) {
    return this.catsService.get(id);
  }

  @Get('/cats')
  async getAll() {
    return this.catsService.getAll();
  }

  @Post('/cats')
  async create(cat: CreateRequest) {
    return this.catsService.create(cat);
  }

  @Put('/cats/:id/names')
  async updateName({ id, name }: UpdateNameRequest) {
    return this.catsService.updateName(id, name);
  }

  @Put('/cats/:id/colors')
  async updateColor({ id, color }: UpdateColorRequest) {
    return this.catsService.updateColor(id, color);
  }

  @Delete('/cats/:id')
  async delete({ id }: BaseRequest) {
    await this.catsService.delete(id);
  }
}
