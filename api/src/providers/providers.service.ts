import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './provider.entity.js';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {}

  async findAll(): Promise<Provider[]> {
    return this.providersRepository.find({
      relations: {
        services: true,
        portfolio: true,
        business_hours: true,
      },
    });
  }

  async findOne(id: string): Promise<Provider> {
    const provider = await this.providersRepository.findOne({
      where: { id },
      relations: {
        services: true,
        portfolio: true,
        business_hours: true,
      },
    });
    
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    
    return provider;
  }

  async create(providerData: Partial<Provider>, user: any): Promise<Provider> {
    const provider = this.providersRepository.create({
      ...providerData,
      user,
    });
    return this.providersRepository.save(provider);
  }

  async seed() {
    const provider = this.providersRepository.create({
      business_name: 'Fade & Flow Barbershop',
      category: 'Barbershop',
      bio: 'Premium grooming experience in the heart of the city. We specialize in classic cuts, modern fades, and straight razor shaves. Step in to relax, and step out looking your best.',
      address: 'Oxford Street, Osu, Accra',
      verified: true,
      is_online: true,
      avg_rating: 4.9,
      rating_count: 128,
      services: [
        { name: 'Signature Haircut', duration: '45 min', price: '450.00', description: 'Premium haircut with hot towel finish.' },
        { name: 'Beard Trim & Line Up', duration: '30 min', price: '250.00', description: 'Detailed beard sculpting with straight razor.' },
        { name: 'The Full Experience', duration: '1 hr 15 min', price: '650.00', description: 'Haircut, beard trim, hot towel shave, and styling.' },
        { name: 'Kids Haircut', duration: '30 min', price: '300.00', description: 'For children under 12.' },
      ],
      portfolio: [
        { image_url: 'https://images.unsplash.com/photo-1622288432450-277d0fce5b95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', service_tag: 'Signature Haircut', caption: 'Clean fade with a sharp line up. Book now! 🔥', likes: 24, comments: 5, rating: 4.8 },
        { image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', service_tag: 'Beard Trim', caption: 'Precision matters.', likes: 18, comments: 2, rating: 5.0 },
        { image_url: 'https://images.unsplash.com/photo-1503739947424-688eb219f7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', service_tag: 'The Full Experience', caption: 'Ready for the weekend.', likes: 32, comments: 8, rating: 4.9 },
      ],
      business_hours: [
        { day_of_week: 'Monday', is_closed: true },
        { day_of_week: 'Tuesday', open_time: '09:00:00', close_time: '19:00:00', is_closed: false },
        { day_of_week: 'Wednesday', open_time: '09:00:00', close_time: '19:00:00', is_closed: false },
        { day_of_week: 'Thursday', open_time: '09:00:00', close_time: '20:00:00', is_closed: false },
        { day_of_week: 'Friday', open_time: '09:00:00', close_time: '20:00:00', is_closed: false },
        { day_of_week: 'Saturday', open_time: '10:00:00', close_time: '18:00:00', is_closed: false },
        { day_of_week: 'Sunday', open_time: '10:00:00', close_time: '16:00:00', is_closed: false },
      ]
    });

    return this.providersRepository.save(provider);
  }
}
