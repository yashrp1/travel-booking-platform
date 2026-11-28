import { Module } from '@nestjs/common';
import { CabsController } from './cabs.controller';
import { CabsService } from './cabs.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CabsController],
  providers: [CabsService],
  exports: [CabsService],
})
export class CabsModule {}
