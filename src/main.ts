import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port');
  await app.listen(port);
  const logger = new Logger('Main');
  logger.log(`Listening on port ${port}`);
}
bootstrap();
