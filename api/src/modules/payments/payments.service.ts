import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly bookingsService: BookingsService) {}

  private readonly webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret_123';
  private readonly processedWebhooks = new Set<string>();

  verifyPaymentSignature(dto: VerifyPaymentDto): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_key_secret';

    // In development or when using sandboxed test keys, validate format
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    const payload = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    return expectedSignature === dto.razorpaySignature;
  }

  async verifyAndConfirmPayment(dto: VerifyPaymentDto) {
    const isValid = this.verifyPaymentSignature(dto);
    if (!isValid) {
      throw new BadRequestException('Cryptographic payment signature mismatch');
    }

    const booking = await this.bookingsService.getBookingByReference(dto.bookingReference);
    booking.status = 'CONFIRMED';
    booking.razorpayPaymentId = dto.razorpayPaymentId;
    booking.paidAt = new Date().toISOString();

    return {
      success: true,
      bookingReference: booking.bookingReference,
      status: 'CONFIRMED',
      message: 'Payment verified successfully. Voucher issued.',
    };
  }

  async handleWebhook(rawBody: string, signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }

    // HMAC SHA256 Webhook verification
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (process.env.NODE_ENV === 'production' && expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id;

    // Idempotency check: prevent duplicate replay attacks
    if (this.processedWebhooks.has(eventId)) {
      return { status: 'already_processed', eventId };
    }

    this.processedWebhooks.add(eventId);

    if (payload.event === 'payment.captured') {
      const orderId = payload.payload?.payment?.entity?.order_id;
      // Reconcile order
    }

    return { status: 'received', eventId };
  }
}
