import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service.js';
import { ProvidersController } from './providers.controller.js';

@Module({
  providers: [ProvidersService],
  controllers: [ProvidersController]
})
export class ProvidersModule {}
