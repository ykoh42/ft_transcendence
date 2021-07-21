import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FortyTwoOauthGuard } from './auth.guard';

@Controller('auth')
export class FortyTwoOauthController {
  @Get('42')
  @UseGuards(FortyTwoOauthGuard)
  async fortyTwoAuth(): Promise<void> {
    // empty
  }

  @Get('42/callback')
  @UseGuards(FortyTwoOauthGuard)
  async fortyTwoCallback(
    @Req()
    req,
  ) {
    return req.user;
  }
}
