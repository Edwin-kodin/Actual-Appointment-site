import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service.js';
import { ProvidersController } from './providers.controller.js';
import { Provider } from './provider.entity.js';
import { Service } from './service.entity.js';
import { PortfolioPost } from './portfolio-post.entity.js';
import { BusinessHour } from './business-hour.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Provider, Service, PortfolioPost, BusinessHour])],
  providers: [ProvidersService],
  controllers: [ProvidersController],
  exports: [ProvidersService],
})
export class ProvidersModule {}
