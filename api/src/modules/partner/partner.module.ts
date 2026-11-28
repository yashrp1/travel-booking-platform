import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { HotelsModule } from '../hotels/hotels.module';
import { CabsModule } from '../cabs/cabs.module';
import { BusesModule } from '../buses/buses.module';
import { BookingsModule } from '../bookings/bookings.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [HotelsModule, CabsModule, BusesModule, BookingsModule, PrismaModule],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
