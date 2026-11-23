import { Module } from '@nestjs/common';
import { OperatorController } from './operator.controller';
import { OperatorService } from './operator.service';
import { CabsModule } from '../cabs/cabs.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [CabsModule, BookingsModule],
  controllers: [OperatorController],
  providers: [OperatorService],
  exports: [OperatorService],
})
export class OperatorModule {}
