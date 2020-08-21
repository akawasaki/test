import { config } from '../config';
import * as IORedis from 'ioredis';

export class Redis extends IORedis {
    constructor(option: IORedis.RedisOptions = config.redis) {
        super(option);
    }
}



