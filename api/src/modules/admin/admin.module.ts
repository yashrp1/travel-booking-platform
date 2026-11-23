import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HotelsModule } from '../hotels/hotels.module';
import { CabsModule } from '../cabs/cabs.module';
import { BusesModule } from '../buses/buses.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
  imports: [HotelsModule, CabsModule, BusesModule, BookingsModule, CouponsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
