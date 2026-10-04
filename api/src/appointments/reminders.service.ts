import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './appointment.entity.js';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  // The engine sweeps the database every 15 minutes looking for matches
  @Cron('0 */15 * * * *')
  async handleUpcomingAppointments() {
    this.logger.log('Running Cron Job: Sweeping for appointments 24 hours away...');
    
    const now = new Date();
    // Look ahead 24 hours with a 15-minute window to catch any in this cycle
    const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(tomorrowStart.getTime() + 15 * 60 * 1000);

    const upcomingAppointments = await this.appointmentRepo.find({
      where: {
        start_time: Between(tomorrowStart, tomorrowEnd),
        status: 'confirmed' // Only remind confirmed bookings
      },
      relations: {
        user: true,
        provider: true,
        service: true
      }
    });

    if (upcomingAppointments.length > 0) {
      this.logger.log(`Found ${upcomingAppointments.length} upcoming appointments. Triggering notification flow...`);
      
      for (const appt of upcomingAppointments) {
        const timeStr = new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const clientName = appt.user?.name || 'Guest';
        const providerName = appt.provider?.business_name || 'Provider';
        const serviceName = appt.service?.name || 'Service';

        // 🔌 PLUG IN TWILIO / SENDGRID HERE
        // e.g. await twilioClient.messages.create({ ... })
        // e.g. await sendgrid.send({ ... })

        this.logger.log(`[Twilio Mock] 📱 SMS to Client (${clientName}): "Reminder: Your ${serviceName} with ${providerName} is tomorrow at ${timeStr}!"`);
        
        this.logger.log(`[SendGrid Mock] 📧 Email to Provider (${providerName}): "Reminder: You have a ${serviceName} appointment with ${clientName} tomorrow at ${timeStr}."`);
      }
    } else {
      this.logger.log('No matches found in this sweep cycle.');
    }
  }

  // Another sweeping cycle for 2-hour warnings
  @Cron('0 0 * * * *')
  async handleImmediateReminders() {
    this.logger.log('Running Cron Job: Sweeping for appointments 2 hours away...');
    // Implementation would be similar, checking window for now + 2 hours
  }
}
