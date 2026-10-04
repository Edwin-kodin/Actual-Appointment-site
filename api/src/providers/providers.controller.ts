import { Controller, Get, Param, Post, Body, Request } from '@nestjs/common';
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

  @Post('portfolio/:postId/like')
  async likePost(@Param('postId') postId: string) {
    return this.providersService.likePortfolioPost(postId);
  }

  @Post('portfolio/:postId/comment')
  async commentPost(@Param('postId') postId: string, @Body('text') text: string, @Request() req: any) {
    const mockUser = req.user || { name: 'Edwin Allotey' }; // Prototype mock
    return this.providersService.commentPortfolioPost(postId, text, mockUser);
  }
}
