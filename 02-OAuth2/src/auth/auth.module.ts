import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoOauthController } from './auth.controller';
import { FortyTwoOauthStrategy } from './strategy/ft.strategy';

@Module({
  imports: [ConfigModule],
  controllers: [FortyTwoOauthController],
  providers: [FortyTwoOauthStrategy],
})
export class FortyTwoOauthModule {}
