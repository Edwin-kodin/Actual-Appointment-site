import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { ProvidersService } from '../providers/providers.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private providersService: ProvidersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: any) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Create user
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: registerDto.accountType === 'provider' ? 'provider' as any : 'customer' as any,
      location: registerDto.location,
      bio: registerDto.bio,
      avatar_url: registerDto.profilePic,
    });

    // If provider, create provider profile
    if (registerDto.accountType === 'provider') {
      await this.providersService.create({
        business_name: registerDto.businessName,
        category: registerDto.category,
        bio: registerDto.bio,
        address: registerDto.location,
      }, user);
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
    };
  }

  async login(loginDto: any) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
    };
  }
}
