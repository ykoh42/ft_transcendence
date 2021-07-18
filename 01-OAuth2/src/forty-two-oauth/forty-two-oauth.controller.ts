import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FortyTwoOauthGuard } from './forty-two-oauth.guard';

@Controller('auth/42')
export class FortyTwoOauthController {
  @Get()
  @UseGuards(FortyTwoOauthGuard)
  async fortyTwoAuth(): Promise<void> {
    // empty
  }

  @Get('callback')
  @UseGuards(FortyTwoOauthGuard)
  async fortyTwoCallback(
    @Req()
    req,
  ) {
    return req.user;
  }
}
