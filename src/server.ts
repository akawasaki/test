import 'reflect-metadata';
import { Router } from './controllers/';
import { MainServer } from './MainServer';
import { container, singleton } from 'tsyringe';
import { CatService } from './services/CatService';

@singleton()
export class Main {
  constructor(private readonly mainServer: MainServer, private readonly router: Router) {}
  async init() {
    this.router.init();
    await this.mainServer.listen();
  }
}

container.register('ICatService', { useClass: CatService });
const main = container.resolve(Main);

Promise.resolve(main.init()).then();
