import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { Provider } from '../providers/provider.entity.js';
import { Service } from '../providers/service.entity.js';
import { BusinessHour } from '../providers/business-hour.entity.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Provider)
    private providerRepo: Repository<Provider>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(BusinessHour)
    private businessHourRepo: Repository<BusinessHour>,
  ) {}

  async createAppointment(userId: string, providerId: string, serviceId: string, startTimeIso: string) {
    const provider = await this.providerRepo.findOne({ where: { id: providerId } });
    if (!provider) throw new NotFoundException('Provider not found');

    const service = await this.serviceRepo.findOne({ where: { id: serviceId, provider: { id: providerId } } });
    if (!service) throw new NotFoundException('Service not found');

    const startTime = new Date(startTimeIso);
    
    // Parse service duration (assuming format like "60" for minutes or "1h", let's assume it's just minutes as string/number for simplicity, wait, let's check schema: it's a string, e.g., '60')
    const durationMinutes = parseInt(service.duration, 10) || 60; 
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // 1. Check if provider is open on this day
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][startTime.getDay()];
    const businessHour = await this.businessHourRepo.findOne({ 
      where: { provider: { id: providerId }, day_of_week: dayOfWeek } 
    });

    if (!businessHour || businessHour.is_closed) {
      throw new BadRequestException('Provider is closed on this day');
    }

    // Convert times for checking business hours
    const startHourStr = startTime.toTimeString().substring(0, 8); // "HH:MM:SS"
    const endHourStr = endTime.toTimeString().substring(0, 8);
    
    if (startHourStr < businessHour.open_time || endHourStr > businessHour.close_time) {
      throw new BadRequestException('Time is outside business hours');
    }

    // 2. Check for conflicts
    const conflicting = await this.appointmentRepo.findOne({
      where: {
        provider: { id: providerId },
        status: 'confirmed', // or pending
        start_time: LessThan(endTime),
        end_time: MoreThan(startTime),
      },
    });

    if (conflicting) {
      throw new BadRequestException('Time slot is already booked');
    }

    // 3. Create appointment
    const appointment = this.appointmentRepo.create({
      user: { id: userId },
      provider: { id: providerId },
      service: { id: serviceId },
      start_time: startTime,
      end_time: endTime,
      total_price: parseFloat(service.price) || 0,
      status: 'pending',
    });

    return await this.appointmentRepo.save(appointment);
  }

  async getProviderAvailability(providerId: string, dateIso: string) {
    const targetDate = new Date(dateIso);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][targetDate.getDay()];
    
    const businessHour = await this.businessHourRepo.findOne({
      where: { provider: { id: providerId }, day_of_week: dayOfWeek }
    });

    if (!businessHour || businessHour.is_closed) {
      return { availableSlots: [] };
    }

    // Fetch existing appointments for the day
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const appointments = await this.appointmentRepo.find({
      where: {
        provider: { id: providerId },
        start_time: Between(startOfDay, endOfDay),
        // we could filter by status !== cancelled
      }
    });

    // We can generate slots here. For now, returning basic info.
    return {
      businessHour,
      bookedAppointments: appointments.map(a => ({
        startTime: a.start_time,
        endTime: a.end_time,
      }))
    };
  }

  async getUserAppointments(userId: string) {
    return this.appointmentRepo.find({
      where: { user: { id: userId } },
      relations: { provider: true, service: true },
      order: { start_time: 'DESC' }
    });
  }

  async getProviderAppointments(providerId: string) {
    return this.appointmentRepo.find({
      where: { provider: { id: providerId } },
      relations: { user: true, service: true },
      order: { start_time: 'ASC' }
    });
  }

  async updateStatus(id: string, providerId: string, status: string) {
    const appt = await this.appointmentRepo.findOne({ where: { id, provider: { id: providerId } } });
    if (!appt) throw new NotFoundException('Appointment not found');
    
    appt.status = status;
    return this.appointmentRepo.save(appt);
  }

  async cancelAppointment(id: string, userId: string, role: 'client' | 'provider', reason: string) {
    const appt = await this.appointmentRepo.findOne({ 
      where: { id },
      relations: { user: true, provider: true }
    });
    
    if (!appt) throw new NotFoundException('Appointment not found');
    if (appt.status === 'cancelled') throw new BadRequestException('Appointment is already cancelled');
    
    // Check ownership
    if (role === 'client' && appt.user.id !== userId) throw new BadRequestException('Unauthorized to cancel this appointment');
    if (role === 'provider' && appt.provider.id !== userId) throw new BadRequestException('Unauthorized to cancel this appointment');
    
    const now = new Date();
    const hoursUntilAppt = (new Date(appt.start_time).getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let penalty = 0;
    // Penalty logic: 20% of the price if cancelled within 24 hours of start time
    if (hoursUntilAppt > 0 && hoursUntilAppt <= 24) {
      penalty = parseFloat((Number(appt.total_price) * 0.2).toFixed(2));
    }

    appt.status = 'cancelled';
    appt.cancellation_reason = reason;
    appt.penalty_fee = penalty;

    return this.appointmentRepo.save(appt);
  }
}
