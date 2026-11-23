import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay signature and confirm reservation' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyAndConfirmPayment(dto);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Razorpay webhook listener for asynchronous event capture' })
  async handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string
  ) {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}
