import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { CabsModule } from './modules/cabs/cabs.module';
import { BusesModule } from './modules/buses/buses.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { PartnerModule } from './modules/partner/partner.module';
import { OperatorModule } from './modules/operator/operator.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    HotelsModule,
    CabsModule,
    BusesModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    CouponsModule,
    PartnerModule,
    OperatorModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
