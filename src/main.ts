import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api')
	// /api/v1/endPoint 1

  await app.listen(AppModule.port);
}
bootstrap();
