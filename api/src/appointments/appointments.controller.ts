import { Controller, Post, Body, Get, Param, Query, UseGuards, Request, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { providerId: string; serviceId: string; startTime: string }) {
    const userId = req.user?.userId || '11111111-1111-1111-1111-111111111111'; // Temporary mock if no guard is applied
    return this.appointmentsService.createAppointment(
      userId,
      body.providerId,
      body.serviceId,
      body.startTime,
    );
  }

  @Get('availability/:providerId')
  async getAvailability(@Param('providerId') providerId: string, @Query('date') date: string) {
    return this.appointmentsService.getProviderAvailability(providerId, date);
  }

  @Get('me')
  async getMyAppointments(@Request() req: any) {
    const userId = req.user?.userId || '11111111-1111-1111-1111-111111111111';
    return this.appointmentsService.getUserAppointments(userId);
  }

  @Get('provider')
  async getProviderSchedule(@Request() req: any) {
    // In a real app, this providerId would come from the logged-in user's JWT provider profile
    // Since we seeded "Fade & Flow Barbershop", we use its UUID here for the prototype dashboard
    const providerId = req.user?.providerId || '5ae2a1de-53bb-4b39-b1e2-2da0079a221e';
    return this.appointmentsService.getProviderAppointments(providerId);
  }

  @Patch(':id/status')
  async updateStatus(@Request() req: any, @Param('id') id: string, @Body('status') status: string) {
    const providerId = req.user?.providerId || '5ae2a1de-53bb-4b39-b1e2-2da0079a221e'; 
    return this.appointmentsService.updateStatus(id, providerId, status);
  }

  @Post(':id/cancel')
  async cancelAppointment(
    @Request() req: any, 
    @Param('id') id: string, 
    @Body('reason') reason: string,
    @Body('role') role: 'client' | 'provider' // Usually determined from JWT claims
  ) {
    const userId = role === 'provider' 
      ? (req.user?.providerId || '5ae2a1de-53bb-4b39-b1e2-2da0079a221e')
      : (req.user?.userId || '11111111-1111-1111-1111-111111111111');
      
    return this.appointmentsService.cancelAppointment(id, userId, role, reason);
  }
}
