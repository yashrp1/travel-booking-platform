import { Injectable, BadRequestException } from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto, LoginDto, RegisterDto } from './dto/auth.dto';

export interface CustomerUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tier: string;
  walletCoins: number;
  token: string;
}

@Injectable()
export class AuthService {
  private readonly users = new Map<string, CustomerUser>();
  private readonly otps = new Map<string, string>();

  constructor() {
    // Seed default verified test customer
    this.users.set('+919876543210', {
      id: 'usr_rahul_sharma',
      name: 'Rahul Sharma',
      firstName: 'Rahul',
      lastName: 'Sharma',
      phone: '+919876543210',
      email: 'rahul.sharma@example.com',
      tier: 'Platinum Member',
      walletCoins: 1250,
      token: 'jwt_demo_token_rahul_sharma',
    });
  }

  async sendOtp(dto: SendOtpDto) {
    const cleanPhone = dto.phone.replace(/[^0-9+]/g, '');
    const otp = '123456'; // Standard development OTP
    this.otps.set(cleanPhone, otp);

    return {
      success: true,
      message: 'OTP sent successfully to ' + cleanPhone,
      otp, // Provided for instant developer testing
      expiresIn: 300,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const cleanPhone = dto.phone.replace(/[^0-9+]/g, '');
    const validOtp = this.otps.get(cleanPhone) || '123456';

    if (dto.otp !== validOtp && dto.otp !== '123456') {
      throw new BadRequestException('Invalid OTP. Use test code 123456');
    }

    let user = this.users.get(cleanPhone);
    const fullName = dto.name?.trim() || user?.name || 'Rahul Sharma';
    const parts = fullName.split(' ');
    const firstName = parts[0] || 'Rahul';
    const lastName = parts.slice(1).join(' ') || 'Sharma';
    const email = dto.email?.trim() || user?.email || 'rahul.sharma@example.com';

    if (!user) {
      user = {
        id: 'usr_' + Date.now().toString(),
        name: fullName,
        firstName,
        lastName,
        phone: cleanPhone,
        email,
        tier: 'Gold Member',
        walletCoins: 500, // 500 Welcome WanderCoins
        token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(),
      };
      this.users.set(cleanPhone, user);
    } else {
      user.name = fullName;
      user.firstName = firstName;
      user.lastName = lastName;
      if (dto.email) user.email = email;
    }

    return {
      success: true,
      message: 'Login successful',
      token: user.token,
      user,
    };
  }

  async login(dto: LoginDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === cleanEmail) {
        return {
          status: true,
          success: true,
          message: 'Login successful',
          token: user.token,
          user,
        };
      }
    }

    const name = cleanEmail.split('@')[0];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const user: CustomerUser = {
      id: 'usr_' + Date.now(),
      name: capitalized + ' Traveler',
      firstName: capitalized,
      lastName: 'Traveler',
      phone: '+919876543210',
      email: cleanEmail,
      tier: 'Gold Member',
      walletCoins: 750,
      token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(),
    };
    this.users.set(user.email, user);

    return {
      status: true,
      success: true,
      message: 'Login successful',
      token: user.token,
      user,
    };
  }

  async register(dto: RegisterDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanPhone = (dto.phone || '+91' + Math.floor(1000000000 + Math.random() * 9000000000)).replace(/[^0-9+]/g, '');
    const parts = dto.name.trim().split(' ');
    const firstName = parts[0] || 'Traveler';
    const lastName = parts.slice(1).join(' ') || '';

    const user: CustomerUser = {
      id: 'usr_' + Date.now().toString(),
      name: dto.name.trim(),
      firstName,
      lastName,
      phone: cleanPhone,
      email: cleanEmail,
      tier: 'Platinum Member',
      walletCoins: 1000, // 1000 Welcome WanderCoins for joining!
      token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(),
    };
    this.users.set(cleanEmail, user);
    this.users.set(cleanPhone, user);

    return {
      status: true,
      success: true,
      message: 'Account created successfully',
      token: user.token,
      user,
    };
  }

  async getProfile(phoneOrId: string) {
    for (const user of this.users.values()) {
      if (user.id === phoneOrId || user.phone === phoneOrId || user.email === phoneOrId) {
        return user;
      }
    }
    // Return default profile
    return this.users.get('+919876543210');
  }
}
