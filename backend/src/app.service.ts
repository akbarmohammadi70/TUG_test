import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  private redisClient;
  private ttl: number;

  constructor() {
    this.ttl = Number(process.env.CACHE_TTL) || 60;
    this.redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    this.redisClient.connect();
  }

  async getData(): Promise<any> {
    const cached = await this.redisClient.get('cachedData');
    if (cached) {
      console.log('Successfully from cache');
      return JSON.parse(cached);
    }

    console.log('generating new data');
    const data = { message: 'Hello from NestJS backend!' };
    await this.redisClient.setEx('cachedData', this.ttl, JSON.stringify(data));
    return data;
  }

  async invalidateCache() {
    await this.redisClient.del('cachedData');
    return { message: 'Cache invalidated' };
  }
}
