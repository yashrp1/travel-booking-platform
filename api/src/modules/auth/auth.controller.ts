import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send 6-digit OTP to mobile phone for guest login/register' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify 6-digit OTP and issue customer token & profile' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Customer login with email and password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Customer register new account with email and password' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get customer privilege profile and loyalty coins' })
  async getProfile(@Query('identifier') identifier?: string) {
    return this.authService.getProfile(identifier || '+919876543210');
  }

  @Get('user/profile')
  @ApiOperation({ summary: 'Get user profile alias' })
  async getUserProfile(@Query('identifier') identifier?: string) {
    return this.authService.getProfile(identifier || '+919876543210');
  }
}
