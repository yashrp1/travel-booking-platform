import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      // In development mode, proceed gracefully if DB is offline; mock adapters handle fallbacks
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
