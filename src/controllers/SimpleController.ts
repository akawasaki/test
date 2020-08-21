import { Get } from './Router';
import { Post } from './Router';
import {CatsService} from "../services/CatsService";

export class SimpleController {
    constructor(private readonly catsService: CatsService) {
    }

    @Get('/health')
    async healthCheck() {
        return 'I\'m alive!';
    }

    @Get('/cats')
    async get() {
        const key = '1';
        return await this.catsService.get(key);
    }

    @Get('/catsp')
    async create() {
        await this.catsService.create();
        return 'A cat is created!';
    }
}
