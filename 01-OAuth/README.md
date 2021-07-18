# OAuth

## 목표

1. `Passport-42`를 통해 `OAuth`를 구현한다.
   http://www.passportjs.org/packages/passport-42/

## Routing

`module`을 설치하고 `ConfigModule`을 `import` 합니다.

```sh
nest g mo FortyTwoOAuth
```

### forty-two-oauth.module.ts

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
})
export class FortyTwoOauthModule {}
```

`controlloer`를 설치하고 경로를 설정합니다.

- `http://localhost:3000/auth/42`
- `http://localhost:3000/auth/42/callback`

```sh
nest g co FortyTwoOAuth
```

### forty-two-oauth.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('auth/42')
export class FortyTwoOauthController {
  @Get()
  async fortyTwoAuth(): Promise<void> {
    // empty
  }

  @Get('callback')
  async fortyTwoCallback(): Promise<void> {
    // empty
  }
}
```

## Passport.js

### 패키지 설치

```sh
yarn add @nestjs/passport passport passport-42
```

### forty-two-strategy.ts

`FortyTwoOauthStrategy`를 만들어 줍니다.

```ts
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
```

### forty-two-oauth.module.ts

`module`에 `FortyTwoOauthStrategy`를 `injection` 합니다.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoOauthController } from './forty-two-oauth.controller';
import { FortyTwoOauthStrategy } from './forty-two-strategy'; // added

@Module({
  imports: [ConfigModule],
  controllers: [FortyTwoOauthController],
  providers: [FortyTwoOauthStrategy], // added
})
export class FortyTwoOauthModule {}
```

### forty-two-oauth.guard.ts

`FortyTwoOauthGuard`를 만듭니다.

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoOauthGuard extends AuthGuard('42') {}
```

### forty-two-oauth.controller.ts

`controller`에서 `FortyTwoOauthGuard`사용하고, `req.user`를 반환합니다.

```ts
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
```

### 동작 확인

`http://localhost:3000/auth/42` 로 접속합니다.
