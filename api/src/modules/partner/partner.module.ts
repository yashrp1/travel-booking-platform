import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { HotelsModule } from '../hotels/hotels.module';
import { CabsModule } from '../cabs/cabs.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [HotelsModule, CabsModule, BookingsModule],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
