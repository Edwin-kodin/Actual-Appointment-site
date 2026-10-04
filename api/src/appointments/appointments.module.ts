import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity.js';
import { Provider } from '../providers/provider.entity.js';
import { Service } from '../providers/service.entity.js';
import { BusinessHour } from '../providers/business-hour.entity.js';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentsController } from './appointments.controller.js';
import { RemindersService } from './reminders.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Provider, Service, BusinessHour]),
  ],
  providers: [AppointmentsService, RemindersService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
