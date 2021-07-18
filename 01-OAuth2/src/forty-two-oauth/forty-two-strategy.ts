import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';

@Injectable()
export class FortyTwoOauthStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('FORTYTWO_APP_ID'),
      clientSecret: configService.get<string>('FORTYTWO_APP_SECRET'),
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    const { username, profileUrl } = profile;
    const user = {
      username,
      profileUrl,
      accessToken,
      refreshToken,
    };
    return cb(null, user);
  }
}
