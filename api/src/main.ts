import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('WanderStay Travel Booking API')
    .setDescription(
      'MakeMyTrip-inspired Hotel & Cab Booking Platform REST APIs, Swagger Documentation & Webhook Specifications.'
    )
    .setVersion('1.0')
    .addTag('Hotels', 'Hotel discovery, destination autocomplete and room pricing')
    .addTag('Cabs', 'Cab routing, distance matrix calculations and vehicle tiers')
    .addTag('Bookings', 'Reservation lifecycle, vouchers and cancellations')
    .addTag('Payments', 'Razorpay checkout verification and webhook listeners')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 WanderStay Backend API running on http://0.0.0.0:${port}/api/v1`);
  console.log(`📖 Swagger API Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
