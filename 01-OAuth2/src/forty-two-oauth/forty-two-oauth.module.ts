import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoOauthController } from './forty-two-oauth.controller';
import { FortyTwoOauthStrategy } from './forty-two-strategy';

@Module({
  imports: [ConfigModule],
  controllers: [FortyTwoOauthController],
  providers: [FortyTwoOauthStrategy],
})
export class FortyTwoOauthModule {}
