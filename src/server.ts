import {MainServer} from "./MainServer";
import {Router} from "./controllers/Router";
import {SimpleController} from "./controllers/SimpleController";
import {Redis} from "./clients/Redis";
import {CatsService} from "./services/CatsService";

class Main {
    constructor(private readonly mainServer: MainServer, private readonly router: Router) {

    }
    async init() {
        this.router.init();
        await this.mainServer.listen();
    }
}

const mainServer = new MainServer();
const redis = new Redis();
const catService = new CatsService(redis);
const controller = new SimpleController(catService);
const router = new Router(mainServer, controller);
const main = new Main(mainServer, router);

Promise.resolve(main.init()).then();



