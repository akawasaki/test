import { MainServer } from './MainServer';
import { Router } from './controllers/Router';
import { CatController } from './controllers/CatController';
import { Redis } from './clients/Redis';
import { CatService } from './services/CatService';
import { CatRepository } from './repositories/CatRepository';

class Main {
  constructor(private readonly mainServer: MainServer, private readonly router: Router) {}
  async init() {
    this.router.init();
    await this.mainServer.listen();
  }
}

const mainServer = new MainServer();
const redis = new Redis();
const catRepository = new CatRepository(redis);
const catService = new CatService(catRepository);
const controller = new CatController(catService);
const router = new Router(mainServer, controller);
const main = new Main(mainServer, router);

Promise.resolve(main.init()).then();
