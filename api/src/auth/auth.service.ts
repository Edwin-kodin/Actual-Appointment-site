import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  // Temporary in-memory cache for MVP. For production use Redis.
  private otpCache = new Map<string, string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    // Generate a random 4 digit code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save to cache (expires conceptually)
    this.otpCache.set(phone, otp);

    // In a real app, send this via SMS (Hubtel/Termii)
    console.log(`[Mock SMS] OTP for ${phone} is: ${otp}`);
    
    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, code: string) {
    const cachedOtp = this.otpCache.get(phone);
    if (!cachedOtp || cachedOtp !== code) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Clear OTP after successful use
    this.otpCache.delete(phone);

    // Find or create user
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.create(phone);
    }

    // Generate JWT
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
