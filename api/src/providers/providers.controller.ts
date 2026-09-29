import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProvidersService } from './providers.service.js';
import { Provider } from './provider.entity.js';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('seed')
  async seed() {
    return this.providersService.seed();
  }

  @Get()
  async findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Provider> {
    return this.providersService.findOne(id);
  }
}
