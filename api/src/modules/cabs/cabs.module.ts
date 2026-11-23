import { Module } from '@nestjs/common';
import { CabsController } from './cabs.controller';
import { CabsService } from './cabs.service';

@Module({
  controllers: [CabsController],
  providers: [CabsService],
  exports: [CabsService],
})
export class CabsModule {}
