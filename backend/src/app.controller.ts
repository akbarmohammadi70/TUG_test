import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}

  @Get('data')
  getData() {
    return this.appService.getData();
  }

  @Get('invalidate')
  invalidate() {
    return this.appService.invalidateCache();
  }
}
